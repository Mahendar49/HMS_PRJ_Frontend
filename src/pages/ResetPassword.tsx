import React from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from "../api/authApi";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error("Missing token in URL!");
      return;
    }

    try {
      const res = await resetPassword(token, data.newPassword);
      toast.success(res.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="text-center mb-4">Reset Password</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
            placeholder="Enter new password"
            {...register("newPassword", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.newPassword && (
            <div className="invalid-feedback">{errors.newPassword.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className={`form-control ${
              errors.confirmPassword ? "is-invalid" : ""
            }`}
            placeholder="Confirm new password"
            {...register("confirmPassword", {
              required: "Confirm your password",
              validate: (val) =>
                val === watch("newPassword") || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
