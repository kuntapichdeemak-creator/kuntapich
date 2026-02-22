import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, Zap, Shield, Building2, HardHat, TrainFront, Landmark, Waves } from 'lucide-react';
import { SectionTitle } from './Shared';

const DataView = () => {
  return (
    <div className="h-full p-8 overflow-y-auto relative">
      <SectionTitle subtitle="Technical Analysis">
        Why AGF?
      </SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto pb-20">
        
        {/* Safety in Tunneling */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <HardHat />
            </div>
            <h3 className="text-xl font-medium text-slate-800">Safety in Tunneling<br/><span className="text-sm font-normal text-slate-500">ความปลอดภัยงานอุโมงค์</span></h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <Zap className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium block text-slate-700">เพิ่มกำลังรับแรงเฉือนของดิน</span>
                <span className="text-sm text-slate-500">Soil shear strength improvement</span>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium block text-slate-700">ป้องกันการพังทลายของหน้าขุด</span>
                <span className="text-sm text-slate-500">Face stability protection</span>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <Waves className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium block text-slate-700">ลดการไหลของน้ำใต้ดินเข้าสู่อุโมงค์</span>
                <span className="text-sm text-slate-500">Groundwater control</span>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Protecting Urban Heritage */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <Building2 />
            </div>
            <h3 className="text-xl font-medium text-slate-800">Protecting Urban Heritage<br/><span className="text-sm font-normal text-slate-500">งานใกล้อาคารเก่า</span></h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
              <div>
                <span className="font-medium block text-slate-700">No Vibration</span>
                <span className="text-sm text-slate-500">ไม่มีแรงสั่นสะเทือนจากการก่อสร้าง</span>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
              <div>
                <span className="font-medium block text-slate-700">Precision</span>
                <span className="text-sm text-slate-500">ควบคุมการเคลื่อนตัวของดินได้อย่างแม่นยำ</span>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
              <div>
                <span className="font-medium block text-slate-700">Non-Invasive</span>
                <span className="text-sm text-slate-500">ก่อสร้างใต้ฐานรากได้โดยไม่ต้องรื้อถอน</span>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Advantages */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-green-50/50 p-6 rounded-2xl border border-green-100"
        >
          <div className="flex items-center gap-3 mb-4 text-green-700">
            <CheckCircle2 />
            <h3 className="font-medium text-lg">Advantages (ข้อดี)</h3>
          </div>
          <ul className="space-y-3 text-slate-700 text-sm">
            <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"/>ใช้ได้กับดินทุกชนิด</li>
            <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"/>ให้ความแข็งแรงและกันน้ำได้สูง</li>
            <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"/>ควบคุมรูปทรงได้แม่นยำ</li>
            <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"/>ปลอดภัยต่ออาคารและสิ่งแวดล้อม</li>
          </ul>
        </motion.div>

        {/* Limitations */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-red-50/50 p-6 rounded-2xl border border-red-100"
        >
          <div className="flex items-center gap-3 mb-4 text-red-700">
            <AlertTriangle />
            <h3 className="font-medium text-lg">Limitations (ข้อจำกัด)</h3>
          </div>
          <ul className="space-y-3 text-slate-700 text-sm">
            <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"/>ค่าใช้จ่ายสูง</li>
            <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"/>ใช้พลังงานมาก</li>
            <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"/>ต้องควบคุมอุณหภูมิอย่างต่อเนื่อง</li>
            <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"/>เป็นวิธีชั่วคราว ไม่ปรับปรุงดินถาวร</li>
          </ul>
        </motion.div>

      </div>

      {/* Common Applications */}
      <div className="max-w-6xl mx-auto pb-12">
        <h3 className="text-xl font-medium text-slate-800 mb-6">Common Applications (ตัวอย่างการใช้งานจริง)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <TrainFront className="w-8 h-8 text-cyan-600" />, text: "งานขุดอุโมงค์รถไฟฟ้าใต้ดินในเขตเมือง" },
            { icon: <div className="w-8 h-8 border-2 border-cyan-600 border-t-0" />, text: "งานก่อสร้างหลุมลึกสำหรับสถานีใต้ดิน" },
            { icon: <Landmark className="w-8 h-8 text-cyan-600" />, text: "งานใกล้อาคารเก่าและโบราณสถาน" },
            { icon: <Waves className="w-8 h-8 text-cyan-600" />, text: "พื้นที่ที่มีระดับน้ำใต้ดินสูง" },
          ].map((app, i) => (
            <motion.div 
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-cyan-50 p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:bg-cyan-100 transition-colors"
            >
              {app.icon}
              <span className="text-sm font-medium text-slate-700">{app.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DataView;
