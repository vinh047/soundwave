"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
// 1. Thêm icon ArrowLeft, Eye, EyeOff
import { X, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

// Định nghĩa các "màn hình" (views)
type View = "select" | "password";

export const AuthModal = () => {
  const { isOpen, onClose } = useAuthModal();

  // 2. Thêm state để quản lý view, email, password
  const [view, setView] = useState<View>("select");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // 1. Thêm state mới để theo dõi focus
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
      // 3. Reset về view ban đầu khi modal đóng
      setTimeout(() => {
        setView("select");
        setEmail("");
        setPassword("");
        setIsEmailFocused(false); // 2. Reset state focus
      }, 300); // Đợi animation đóng modal
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", {
      prompt: "select_account",
    });
  };

  // 4. Hàm xử lý khi nhấn "Continue" với email
  const handleEmailContinue = () => {
    // (Bạn có thể thêm validation email ở đây)
    if (email) {
      setView("password"); // Chuyển sang view nhập mật khẩu
    }
  };

  // 5. Hàm xử lý đăng nhập bằng email/password
  const handlePasswordLogin = () => {
    console.log("Đăng nhập với:", email, password);
    // TODO: Gọi signIn với provider "credentials"
    // signIn('credentials', {
    //   email,
    //   password,
    //   callbackUrl: '/'
    // });
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
          {/* 6. Nút "Back" (chỉ hiện ở view password) */}
          {view === "password" && (
            <button
              onClick={() => {
                setView("select");
                setIsEmailFocused(false); // 3. Reset state focus khi "Back"
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

          {/* ----- 7. Render nội dung dựa trên state 'view' ----- */}
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
                    <button
                      className="
                        w-full flex items-center justify-center py-2.5 px-4
                        rounded-md bg-white text-gray-700 font-medium
                        border border-gray-300 hover:bg-gray-50 transition shadow-sm
                      "
                      onClick={handleGoogleLogin}
                    >
                      <FcGoogle size={22} className="mr-3" />
                      Continue with Google
                    </button>
                  </div>
                  <div className="relative w-full flex items-center justify-center text-xs text-gray-400 mb-6">
                    <hr className="w-full border-gray-200 absolute" />
                    <span className="bg-white px-2 z-10">Or with email</span>
                  </div>
                </>
              )}

              {/* Phần email input và button luôn hiển thị */}
              <div className="w-full space-y-4">
                <input
                  type="email"
                  placeholder="Your email address or profile URL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  className="
                    w-full p-3 rounded-md bg-white text-black
                    border border-gray-300
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                    focus:outline-none placeholder-gray-400
                  "
                />
                <button
                  className="
                    w-full py-3 px-4 rounded-md bg-blue-500 text-white
                    font-semibold hover:bg-blue-600 transition
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  onClick={handleEmailContinue}
                  disabled={!email}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
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
                  Your email address or profile URL
                </label>
                <p className="text-gray-900 font-medium">{email}</p>
              </div>

              {/* Form nhập mật khẩu */}
              <div className="w-full space-y-4">
                {/* Input Mật khẩu với icon Mắt */}
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Your Password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                      w-full p-3 rounded-md bg-white text-black
                      border border-gray-300
                      focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                      focus:outline-none placeholder-gray-400
                      pr-10
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="
                      absolute right-3 top-1/2 -translate-y-1/2
                      text-gray-400 hover:text-gray-600
                    "
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  className="
                    w-full py-3 px-4 rounded-md bg-blue-500 text-white
                    font-semibold hover:bg-blue-600 transition
                  "
                  onClick={handlePasswordLogin}
                >
                  Continue
                </button>
              </div>

              {/* Quên mật khẩu */}
              <a
                href="#"
                className="text-blue-500 text-sm mt-5 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          )}
          {/* ----- Kết thúc nội dung modal ----- */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
