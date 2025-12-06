"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import * as Dialog from "@radix-ui/react-dialog";
import { X, ArrowLeft } from "lucide-react";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

import authApi from "@/lib/api/authApi";
import userApi from "@/lib/api/usersApi";
import { isValidEmail } from "@/lib/utils/validation";
import { useAuth } from "@/app/contexts/AuthContext";
import { AxiosError } from "axios";

import AOS from "aos";
import "aos/dist/aos.css";

type View = "select" | "password" | "verification-message";

export const AuthModal = () => {
  const { isOpen, onClose } = useAuthModal();

  const { login } = useAuth();

  const [view, setView] = useState<View>("select");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [verificationSentMessage, setVerificationSentMessage] = useState("");
  const [isExistingUser, setIsExistingUser] = useState<boolean>(true);

  const [isClosing, setIsClosing] = useState(false); // <-- state để animate closing

  const router = useRouter();

  // Init AOS once
  useEffect(() => {
    AOS.init({
      duration: 320,
      easing: "ease-out-cubic",
      once: true, // mỗi phần tử animate 1 lần khi xuất hiện
    });
  }, []);

  // refresh AOS khi modal mở (để AOS bắt các data-aos vừa render)
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      // small timeout để DOM thu xếp trước khi refresh
      setTimeout(() => AOS.refresh(), 50);
    }
  }, [isOpen]);

  // Thay đổi: onChange sẽ delay gọi onClose để show animation đóng
  const onChange = (open: boolean) => {
    if (!open) {
      // bắt sự kiện đóng: bật isClosing để apply CSS animation đóng
      setIsClosing(true);

      // đợi animation hoàn tất rồi gọi onClose thực sự (và reset nội dung sau đó)
      const CLOSE_ANIM_DURATION = 260; // ms, khớp với CSS keyframes
      setTimeout(() => {
        onClose();
        // reset nội dung sau khi modal đã đóng (giữ delay tách biệt)
        setTimeout(() => {
          setView("select");
          setEmail("");
          setPassword("");
          setName("");
          setApiError("");
          setIsEmailFocused(false);
          setIsClosing(false);
        }, 50);
      }, CLOSE_ANIM_DURATION);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    window.location.href = `${apiUrl}/auth/google`;
  };

  const handleEmailContinue = async () => {
    setEmailError("");

    if (!email || email.trim() === "") {
      setEmailError("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    try {
      const { data } = await userApi.checkEmail(email);
      if (data.method === "GOOGLE") {
        setEmailError(
          "Email này đã được đăng ký bằng Google. Vui lòng đăng nhập bằng Google."
        );
      } else if (data.method === "NEW_USER") {
        setIsExistingUser(false);
        setView("password");
      } else {
        setView("password");
      }
    } catch (error) {
      setApiError("Không thể kiểm tra email. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    setPasswordError("");
    setApiError("");

    if (!password || password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setIsLoading(true);

    try {
      const { data: result } = await authApi.authenticateOrRegister({
        email,
        password,
        name,
      });

      if (result.action === "LOGIN_SUCCESS") {
        login(result);
        toast.success("Đăng nhập thành công!");
        router.push("/home");
        // đóng modal với animation
        onChange(false);
      } else if (result.action === "VERIFY_REQUIRED") {
        const verifyResult = result as { message: string; email: string };
        setVerificationSentMessage(verifyResult.message);
        setView("verification-message");
      } else {
        setApiError("Phản hồi không xác định.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      const axiosError = error as AxiosError<{ message: string | string[] }>;

      const errorMessage = axiosError.response?.data?.message;

      if (errorMessage) {
        const finalMessage = Array.isArray(errorMessage)
          ? errorMessage[0]
          : errorMessage;
        setApiError(finalMessage || "");
      } else {
        setApiError("Đăng nhập thất bại. Vui lòng kiểm tra lại mật khẩu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const response = await authApi.resendVerification({ email });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      });

    toast.promise(promise, {
      loading: "Đang gửi lại email...",
      success: (data: any) => {
        setVerificationSentMessage(data.message || "Đã gửi lại link!");
        return "Đã gửi lại email. Vui lòng kiểm tra hộp thư!";
      },
      error: "Gửi lại thất bại. Vui lòng thử lại sau.",
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 backdrop-blur-sm fixed inset-0 z-40" />

        <Dialog.Content
          // Khi mở: dùng AOS để animate; khi đóng: apply class animate-modal-out
          data-aos={!isClosing ? "fade-up" : undefined}
          className={`fixed drop-shadow-lg border border-gray-200 top-[50%] left-[50%] max-h-full h-auto md:h-auto w-full md:w-[90vw] md:max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-[25px] focus:outline-none overflow-y-auto z-50 transition-all duration-300 ${
            isClosing ? "animate-modal-out" : ""
          }`}
        >
          {view === "password" && (
            <button
              onClick={() => {
                setView("select");
                setIsEmailFocused(false);
              }}
              className="text-gray-400 hover:text-gray-700 absolute top-[10px] left-[10px] inline-flex h-6 w-6 items-center justify-center rounded-full focus:outline-none"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {view === "select" && isEmailFocused && (
            <button
              onClick={() => {
                setIsEmailFocused(false);
              }}
              className="text-gray-400 hover:text-gray-700 absolute top-[10px] left-[10px] inline-flex h-6 w-6 items-center justify-center rounded-full focus:outline-none"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <Dialog.Close asChild>
            <button
              onClick={() => {
                // khi user click X, trigger animation đóng rồi close qua onChange(false)
                onChange(false);
              }}
              className="text-gray-400 hover:text-gray-700 absolute top-[10px] right-[10px] inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full focus:outline-none cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </Dialog.Close>

          {/* Nội dung view (giữ nguyên phần render của bạn) */}
          {view === "select" ? (
            <div className="flex flex-col items-center">
              <Dialog.Title className="text-gray-900 text-2xl font-semibold mb-4 text-center">
                Sign in or create an account
              </Dialog.Title>

              {!isEmailFocused && (
                <>
                  <Dialog.Description className="text-gray-500 text-sm text-center mb-6">
                    By clicking on "Continue with Google" or "Continue", you
                    agree to SoundCloud's{" "}
                    <a href="#" className="text-blue-500 hover:underline">
                      Terms of Use
                    </a>{" "}
                    and acknowledge our{" "}
                    <a href="#" className="text-blue-500 hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </Dialog.Description>
                  <div className="w-full space-y-3 mb-6">
                    <Button light fullWidth size="lg" onClick={handleGoogleLogin}>
                      <FcGoogle size={22} className="mr-3" />
                      Continue with Google
                    </Button>
                  </div>
                  <div className="relative w-full flex items-center justify-center text-xs text-gray-400 mb-6">
                    <hr className="w-full border-gray-200 absolute" />
                    <span className="bg-white px-2 z-10">Or with email</span>
                  </div>
                </>
              )}

              <div className="w-full space-y-4">
                <div className="flex flex-col gap-1 w-full max-w-sm">
                  <label
                    htmlFor="email-input-id"
                    className="mb-1 text-sm font-medium text-gray-700"
                  >
                    Your email address
                  </label>

                  <Input
                    id="email-input-id"
                    type="email"
                    placeholder="Your email address or profile URL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    error={emailError}
                    size="md"
                    fullWidth
                  />
                </div>
                <Button
                  dark
                  fullWidth
                  onClick={handleEmailContinue}
                  loading={isLoading}
                  disabled={!email}
                >
                  Continue
                </Button>
              </div>
            </div>
          ) : view === "password" ? (
            <div className="flex flex-col items-center">
              <Dialog.Title className="text-gray-900 text-2xl font-semibold mb-4 text-center">
                Welcome back!
              </Dialog.Title>

              <div className="w-full text-left mb-4">
                <label className="text-gray-500 text-sm">Your email address</label>
                <p className="text-gray-900 font-medium">{email}</p>
              </div>

              {!isExistingUser ? (
                <div className="w-full space-y-4 mt-2">
                  <Input
                    type="text"
                    placeholder="Tên của bạn (Tùy chọn cho đăng ký)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-4"
                    fullWidth
                  />
                </div>
              ) : (
                ""
              )}

              <div className="w-full space-y-4 mt-2">
                <div className="relative w-full">
                  <Input
                    type="password"
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={passwordError}
                  />
                </div>

                {apiError && <p className="text-red-500 text-sm mt-[-10px]">{apiError}</p>}

                <Button dark fullWidth onClick={handlePasswordLogin} loading={isLoading}>
                  Continue
                </Button>
              </div>

              <a href="#" className="text-blue-500 text-sm mt-5 hover:underline">
                Forgot your password?
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center p-4 text-center">
              <X size={40} className="text-green-500 mb-4" />
              <Dialog.Title className="text-gray-900 text-2xl font-semibold mb-4">
                Kiểm tra hộp thư của bạn!
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-6">
                {verificationSentMessage}
                <br />
                <span className="font-bold">{email}</span>
              </Dialog.Description>
              <Button dark fullWidth onClick={() => onChange(false)}>
                Đã hiểu
              </Button>
              <Button ghost className="mt-4" onClick={handleResendVerification}>
                Gửi lại email xác thực
              </Button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
