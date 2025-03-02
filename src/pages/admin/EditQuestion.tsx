
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import TransitionWrapper from "@/components/TransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { Option } from "@/types/models";
import { toast } from "@/components/ui/sonner";

const EditQuestion: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { questions, addQuestion, updateQuestion } = useQuiz();
  const isNewQuestion = id === "new";

  const [questionContent, setQuestionContent] = useState("");
  const [options, setOptions] = useState<
    Array<{ id: string; content: string; isCorrect: boolean }>
  >([
    { id: "1", content: "", isCorrect: false },
    { id: "2", content: "", isCorrect: false },
    { id: "3", content: "", isCorrect: false },
    { id: "4", content: "", isCorrect: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "admin") {
      navigate("/role-selection");
      return;
    }

    // If editing an existing question, load it
    if (!isNewQuestion) {
      const question = questions.find((q) => q.id === id);
      if (question) {
        setQuestionContent(question.content);
        setOptions(question.options);
      } else {
        toast.error("Không tìm thấy câu hỏi");
        navigate("/admin/questions");
      }
    }
  }, [id, isNewQuestion, navigate, questions, user]);

  const handleOptionChange = (
    index: number,
    field: "content" | "isCorrect",
    value: string | boolean
  ) => {
    const newOptions = [...options];
    if (field === "isCorrect") {
      // Uncheck all other options
      newOptions.forEach((option, i) => {
        option.isCorrect = i === index;
      });
    } else {
      newOptions[index] = {
        ...newOptions[index],
        [field]: value,
      };
    }
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!questionContent.trim()) {
      toast.error("Vui lòng nhập nội dung câu hỏi");
      return;
    }

    if (options.some((option) => !option.content.trim())) {
      toast.error("Vui lòng nhập đầy đủ nội dung các đáp án");
      return;
    }

    if (!options.some((option) => option.isCorrect)) {
      toast.error("Vui lòng chọn đáp án đúng");
      return;
    }

    try {
      setIsLoading(true);
      
      if (isNewQuestion) {
        await addQuestion({
          content: questionContent,
          options: options,
        });
        toast.success("Thêm câu hỏi thành công");
      } else {
        await updateQuestion(id!, {
          content: questionContent,
          options: options,
        });
        toast.success("Cập nhật câu hỏi thành công");
      }
      
      navigate("/admin/questions");
    } catch (error) {
      toast.error("Không thể lưu câu hỏi");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between mb-8">
          <Logo />
          <button
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/admin/questions")}
          >
            Quay lại danh sách
          </button>
        </header>

        <TransitionWrapper delay={300}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {isNewQuestion ? "Thêm câu hỏi mới" : "Chỉnh sửa câu hỏi"}
            </h1>
          </div>
        </TransitionWrapper>

        <TransitionWrapper delay={400}>
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="question-content">
                  Nội dung câu hỏi
                </label>
                <textarea
                  id="question-content"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nhập nội dung câu hỏi"
                  rows={3}
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Các đáp án:</label>
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={`correct-${option.id}`}
                      name="correct-option"
                      checked={option.isCorrect}
                      onChange={() => handleOptionChange(index, "isCorrect", true)}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder={`Đáp án ${index + 1}`}
                      value={option.content}
                      onChange={(e) =>
                        handleOptionChange(index, "content", e.target.value)
                      }
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  Chọn đáp án đúng bằng cách click vào nút radio bên trái
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                  onClick={() => navigate("/admin/questions")}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Đang lưu...</span>
                  ) : (
                    "Lưu câu hỏi"
                  )}
                </button>
              </div>
            </form>
          </Card>
        </TransitionWrapper>
      </div>
    </Layout>
  );
};

export default EditQuestion;
