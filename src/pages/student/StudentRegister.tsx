
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuiz } from "@/context/QuizContext";
import NeonEffect from "@/components/NeonEffect";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const StudentRegister = () => {
  const navigate = useNavigate();
  const { loginAsStudent } = useAuth();
  const { getExamByCode } = useQuiz();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [className, setClassName] = useState("");
  const [examCode, setExamCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }
    
    if (!studentId.trim()) {
      toast.error("Vui lòng nhập mã sinh viên");
      return;
    }
    
    if (!className.trim()) {
      toast.error("Vui lòng nhập lớp");
      return;
    }
    
    if (!examCode.trim()) {
      toast.error("Vui lòng nhập mã bài thi");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Validate exam code
      const exam = getExamByCode(examCode);
      
      if (!exam) {
        toast.error("Mã bài thi không hợp lệ hoặc không tồn tại");
        setIsSubmitting(false);
        return;
      }
      
      if (!exam.isActive) {
        toast.error("Bài thi đã kết thúc hoặc chưa được kích hoạt");
        setIsSubmitting(false);
        return;
      }
      
      // Login as student
      await loginAsStudent(name, className, studentId, examCode);
      
      // Redirect to waiting page
      toast.success("Đăng ký thành công, đang chuyển đến phòng chờ");
      navigate("/student/waiting");
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi đăng ký");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout className="min-h-screen flex flex-col items-center justify-center">
      <motion.div 
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white p-3 rounded-full shadow-md">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <h1 className="text-red-500 font-bold text-xl">EPUTest</h1>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-1 text-center">Đăng ký tham gia thi</h2>
          <p className="text-muted-foreground text-sm mb-6 text-center">
            Nhập thông tin của bạn để tham gia bài thi
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Họ và tên
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label htmlFor="studentId" className="block text-sm font-medium mb-1">
                Mã sinh viên
              </label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="SV12345"
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label htmlFor="className" className="block text-sm font-medium mb-1">
                Lớp
              </label>
              <Input
                id="className"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="10A1"
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <label htmlFor="examCode" className="block text-sm font-medium mb-1">
                Mã bài thi
              </label>
              <Input
                id="examCode"
                value={examCode}
                onChange={(e) => setExamCode(e.target.value)}
                placeholder="ABC123"
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-sm text-muted-foreground"
            >
              Mã demo để test: DEMO123
            </motion.div>
            
            <motion.div 
              className="pt-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <NeonEffect color="purple" padding="p-0">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Tham gia ngay"}
                </Button>
              </NeonEffect>
            </motion.div>
          </form>
          
          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Link
              to="/role-selection"
              className="text-sm text-primary hover:underline transition-all duration-300"
            >
              Quay lại trang chọn vai trò
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default StudentRegister;
