import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [errormsg, setErrormsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8888/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        user,
        password,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      setErrormsg(err);
      return;
    } else {
      toast.success("เข้าสู่ระบบสำเร็จ", {
        position: "bottom-center",
        hideProgressBar: true,
      });

      setTimeout(() => {
        setRedirect(true);
      }, 1000);
    }
  };

  if (redirect) {
    window.location.replace("/");
  }

  return (
    <div className="card w-full max-w-md mx-auto shadow-xl bg-black mt-20 text-white">
      <div className="card-body">
        <h1 className="text-3xl font-bold mb-4 text-center text-white">
          เข้าสู่ระบบ
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-gray-200">
                อีเมลล์ / ชื่อผู้ใช้ :
              </span>
              {errormsg !== "" && user === "" && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="input input-bordered w-full bg-white text-black border-gray-600"
              placeholder="example@gmail.com"
            />
          </div>

          <div className="form-control mb-4">
            <div className="flex justify-between items-center">
              <label className="label">
                <span className="label-text text-gray-200">รหัสผ่าน :</span>
                {errormsg !== "" && password === "" && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-gray-400 hover:text-gray-200 text-sm"
              >
                {showPass ? "ซ่อน" : "แสดง"}
              </button>
            </div>

            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-white text-black border-gray-600"
              placeholder={showPass ? "Password1234" : "************"}
            />
          </div>

          {errormsg !== "" && (
            <label className="text-red-500 mb-2 block">** {errormsg}</label>
          )}

          <button
            type="submit"
            className="btn btn-neutral w-full text-gray-500 bg-white mt-2 hover:bg-gray-600 hover:text-white"
          >
            ล็อกอิน
          </button>

          <div className="text-center mt-4">
            <Link
              to="/register"
              className="text-gray-300 hover:underline text-sm"
            >
              ไม่มีบัญชีผู้ใช้?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
