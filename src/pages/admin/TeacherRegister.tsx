
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const TeacherRegister: React.FC = () => {
  const navigate = useNavigate();
  const { registerTeacher, isLoading } = useAuth();
  
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error("Vui lòng nhập một địa chỉ email hợp lệ");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    
    try {
      await registerTeacher(name, faculty, email, password);
      toast.success("Đăng ký tài khoản thành công");
      setRegistrationSuccess(true);
    } catch (error: any) {
      if (error.message.includes("already registered")) {
        toast.error("Email này đã được đăng ký");
      } else {
        toast.error(error.message || "Đăng ký thất bại");
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <TransitionWrapper>
          <Logo className="mb-8" />
        </TransitionWrapper>

        <TransitionWrapper delay={300}>
          <Card className="w-full max-w-md">
            <div className="space-y-6 p-6">
              {registrationSuccess ? (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-green-600">Đăng ký thành công!</h1>
                    <p className="text-sm text-muted-foreground">
                      Vui lòng kiểm tra email của bạn để xác thực tài khoản
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-md text-blue-700 text-sm">
                    <p className="font-medium">Hướng dẫn xác thực email:</p>
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      <li>Mở hộp thư đến của email bạn đã đăng ký</li>
                      <li>Tìm email có tiêu đề "Xác thực email" từ Supabase</li>
                      <li>Nhấp vào liên kết xác thực trong email</li>
                      <li>Sau khi xác thực, quay lại trang đăng nhập</li>
                    </ol>
                  </div>
                  
                  <button
                    className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={() => navigate("/admin/login")}
                  >
                    Đi tới trang đăng nhập
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Đăng ký tài khoản Giáo viên</h1>
                    <p className="text-sm text-muted-foreground">
                      Nhập thông tin đăng ký của bạn
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none" htmlFor="name">
                        Họ và tên
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        id="name"
                        placeholder="Nguyễn Văn A"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none" htmlFor="faculty">
                        Khoa
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        id="faculty"
                        placeholder="Công nghệ thông tin"
                        required
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none" htmlFor="email">
                        Email
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        id="email"
                        type="email"
                        placeholder="teacher@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none" htmlFor="password">
                        Mật khẩu
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        id="password"
                        placeholder="••••••••"
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none" htmlFor="confirm-password">
                        Xác nhận mật khẩu
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        id="confirm-password"
                        placeholder="••••••••"
                        required
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    
                    <button
                      className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="animate-pulse">Đang xử lý...</span>
                      ) : (
                        "Đăng ký"
                      )}
                    </button>
                  </form>

                  <div className="text-center text-sm">
                    <p className="text-gray-500">Đã có tài khoản?</p>
                    <button 
                      className="text-primary hover:underline hover:text-primary/80"
                      onClick={() => navigate("/admin/login")}
                    >
                      Đăng nhập
                    </button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default TeacherRegister;
