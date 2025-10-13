import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [errormsg, setErrormsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8888/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        firstname: firstName,
        lastname: lastName,
        date_of_birth: dob,
        email,
        password,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      setErrormsg(err);
      return;
    } else {
      toast.success("ลงทะเบียนผู้ใช้สำเร็จ", {
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
    <div className="card w-full max-w-lg mx-auto shadow-xl bg-black mt-10 text-white">
      <div className="card-body">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          ลงทะเบียน
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-gray-200">ชื่อผู้ใช้ :</span>
              {errormsg !== "" && username === "" && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full bg-white text-black border-gray-600"
              placeholder="username"
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-gray-200">ชื่อจริง :</span>
              {errormsg !== "" && firstName === "" && lastName === "" && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input input-bordered flex-1 bg-white text-black border-gray-600"
                placeholder="ชื่อ"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input input-bordered flex-1 bg-white text-black border-gray-600"
                placeholder="นามสกุล"
              />
            </div>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-gray-200">วันเกิด :</span>
              {errormsg !== "" && dob === "" && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="input input-bordered w-full bg-white text-black border-gray-600"
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-gray-200">อีเมลล์ :</span>
              {errormsg !== "" && email === "" && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}bg-white text-black
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-white text-black border-gray-600"
              placeholder={showPass ? "Password1234" : "************"}
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-gray-200">ยืนยันรหัสผ่าน :</span>
              {errormsg !== "" && confirmPassword === "" && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <input
              type={showPass ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered w-full bg-white text-black border-gray-600"
              placeholder={showPass ? "Password1234" : "************"}
            />
          </div>

          {errormsg !== "" && (
            <label className="text-red-500 mb-2 block">** {errormsg}</label>
          )}
          {password !== "" &&
            confirmPassword !== "" &&
            password !== confirmPassword && (
              <label className="text-red-500 mb-2 block">
                ** โปรดใส่รหัสผ่านให้ตรงกัน
              </label>
            )}

          <button
            type="submit"
            className="btn btn-gray-500 w-full text-black mt-2 hover:bg-gray-600 hover:text-white"
          >
            ลงทะเบียน
          </button>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-gray-300 hover:underline text-sm"
            >
              มีบัญชีผู้ใช้อยู่แล้ว
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
