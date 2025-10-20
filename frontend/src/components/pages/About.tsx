import React from "react";
import { FaHeart } from "react-icons/fa";

function About() {
  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-10 text-white">
      
      <div className="max-w-4xl w-full bg-gray-800 rounded-2xl shadow-lg p-8 pb-12">
        <h1 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2">
          <FaHeart color="red" /> เกี่ยวกับเว็บไซต์นี้
        </h1>

        <p className="text-gray-300 leading-relaxed mb-4">
          เว็บไซต์นี้ถูกสร้างขึ้นเพื่อช่วยให้ผู้ใช้งานสามารถค้นหาและบันทึกงานที่สนใจได้อย่างสะดวก 
          โดยสามารถเพิ่มงานไว้ในรายการโปรดได้เพียงคลิกเดียว ❤️
        </p>

        <p className="text-gray-300 leading-relaxed mb-4">
          ระบบจะรวบรวมประกาศงานจากหลายแหล่ง เช่น JobThai, JobBKK, และ ThaiJobsGov 
          เพื่อให้คุณไม่พลาดโอกาสที่ดีที่สุดในสายอาชีพของคุณ
        </p>

        <p className="text-gray-300 leading-relaxed">
          เว็บไซต์นี้เป็นส่วนหนึ่งของโปรเจกต์ฝึกฝนการพัฒนาเว็บแอปพลิเคชันโดยใช้ React, TypeScript, Node.js และ MongoDB
          เพื่อเรียนรู้การเชื่อมต่อ API และระบบล็อกอิน/บันทึกข้อมูลผู้ใช้
        </p>
      </div>

      <footer className="mt-10 text-gray-500 text-md">
        © {new Date().getFullYear()} JobArchive by Hadsapong Lee 🐱
      </footer>
    </div>
  );
}

export default About;
