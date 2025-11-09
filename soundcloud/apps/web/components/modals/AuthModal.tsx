"use client";
import { useState } from "react";
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

  const router = useRouter();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
      setTimeout(() => {
        setView("select");
        setEmail("");
        setPassword("");
        setName("");
        setApiError("");
        setIsEmailFocused(false);
      }, 300);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    window.location.href = `${apiUrl}/auth/google`;
  };

  // 4. Hàm xử lý khi nhấn "Continue" với email
  const handleEmailContinue = async () => {
    // Xóa lỗi cũ trước khi kiểm tra
    setEmailError("");

    // 1. Kiểm tra trường email có trống không
    if (!email || email.trim() === "") {
      setEmailError("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }

    // 2. Kiểm tra định dạng email bằng hàm tiện ích
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
      // Xử lý lỗi API
      setApiError("Không thể kiểm tra email. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý đăng nhập bằng email/password
  const handlePasswordLogin = async () => {
    setPasswordError("");
    setApiError("");

    // Kiểm tra độ dài mật khẩu (FE Validation)
    if (!password || password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API: Gửi email và mật khẩu lên BE
      const { data: result } = await authApi.authenticateOrRegister({
        email,
        password,
        name,
      });

      if (result.action === "LOGIN_SUCCESS") {
        login(result);
        toast.success("Đăng nhập thành công!");
        router.push("/home");
        onClose();
      } else if (result.action === "VERIFY_REQUIRED") {
        const verifyResult = result as { message: string; email: string };
        setVerificationSentMessage(verifyResult.message);
        setView("verification-message");
      } else {
        // Lỗi logic không mong muốn
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
    // Dùng toast.promise của sonner để xử lý loading/success/error
    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          // 1. Gọi API mới, chỉ gửi email
          const response = await authApi.resendVerification({ email });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      });

    toast.promise(promise, {
      loading: "Đang gửi lại email...",
      success: (data: any) => {
        // 2. Cập nhật lại thông báo nếu muốn
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
          className="
            fixed
            drop-shadow-lg
            border
            border-gray-200
            top-[50%]
            left-[50%]
            max-h-full
            h-auto
            md:h-auto
            w-full
            md:w-[90vw]
            md:max-w-[450px]
            translate-x-[-50%]
            translate-y-[-50%]
            rounded-lg
            bg-white
            p-[25px]
            focus:outline-none
            overflow-y-auto
            z-50
            transition-all duration-300
          "
        >
          {/* Nút "Back" (chỉ hiện ở view password) */}
          {view === "password" && (
            <button
              onClick={() => {
                setView("select");
                setIsEmailFocused(false); // Reset state focus khi "Back"
              }}
              className="
                text-gray-400
                hover:text-gray-700
                absolute
                top-[10px]
                left-[10px]
                inline-flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                focus:outline-none
              "
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* === THÊM NÚT BACK CHO VIEW SELECT (KHI FOCUSED) === */}
          {view === "select" && isEmailFocused && (
            <button
              onClick={() => {
                setIsEmailFocused(false);
              }}
              className="
                text-gray-400
                hover:text-gray-700
                absolute
                top-[10px]
                left-[10px]
                inline-flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                focus:outline-none
              "
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          {/* Nút đóng (X) */}
          <Dialog.Close asChild>
            <button
              className="
                text-gray-400
                hover:text-gray-700
                absolute
                top-[10px]
                right-[10px]
                inline-flex
                h-6
                w-6
                appearance-none
                items-center
                justify-center
                rounded-full
                focus:outline-none
                cursor-pointer
              "
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </Dialog.Close>
          {/* ----- Render nội dung dựa trên state 'view' ----- */}
          {view === "select" ? (
            // -------------------------------------
            // VIEW 1: CHỌN PHƯƠNG THỨC ĐĂNG NHẬP
            // -------------------------------------
            <div className="flex flex-col items-center">
              {/* Tiêu đề luôn hiển thị */}
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
                    <Button
                      light
                      fullWidth
                      size="lg"
                      onClick={handleGoogleLogin}
                    >
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

              {/* Phần email input và button luôn hiển thị */}
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
            // -------------------------------------
            // VIEW 2: NHẬP MẬT KHẨU
            // -------------------------------------
            <div className="flex flex-col items-center">
              <Dialog.Title className="text-gray-900 text-2xl font-semibold mb-4 text-center">
                Welcome back!
              </Dialog.Title>

              {/* Hiển thị email đã nhập */}
              <div className="w-full text-left mb-4">
                <label className="text-gray-500 text-sm">
                  Your email address
                </label>
                <p className="text-gray-900 font-medium">{email}</p>
              </div>

              {/* Input Name (Chỉ hiển thị KHI USER CHƯA TỒN TẠI) */}
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

              {/* Form nhập mật khẩu */}
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

                {apiError && (
                  <p className="text-red-500 text-sm mt-[-10px]">{apiError}</p>
                )}

                <Button
                  dark
                  fullWidth
                  onClick={handlePasswordLogin}
                  loading={isLoading}
                >
                  Continue
                </Button>
              </div>

              {/* Quên mật khẩu */}
              <a
                href="#"
                className="text-blue-500 text-sm mt-5 hover:underline"
              >
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
              <Button dark fullWidth onClick={onClose}>
                Đã hiểu
              </Button>
              <Button ghost className="mt-4" onClick={handleResendVerification}>
                Gửi lại email xác thực
              </Button>
            </div>
          )}
          {/* ----- Kết thúc nội dung modal ----- */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
