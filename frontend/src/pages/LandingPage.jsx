import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Engineering", value: 290, color: "#2B3674" }, // 23%
  { name: "Finance", value: 214, color: "#74B296" },     // 17%
  { name: "Art", value: 163, color: "#DCCD9A" },         // 13%
  { name: "Social", value: 150, color: "#E83D3D" },      // 12%
  { name: "Design", value: 441, color: "#222222" },      // 35%
];

// Custom Icons for the Feature Cards
const SwitchIcon = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="16" fill="#3B4171"/>
    <path d="M22 24L32 32L22 40V24Z" fill="#DDBB7D"/>
    <path d="M42 24L32 32L42 40V24Z" fill="#CCA565"/>
  </svg>
);

const FilesIcon = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="16" fill="#3B4171"/>
    <path d="M32 20L44 32H20L32 20Z" fill="#5F9D7D"/>
    <path d="M32 32L44 44H20L32 32Z" fill="#4B8164"/>
  </svg>
);

const MaterialIcon = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="16" fill="#3B4171"/>
    <path d="M20 32L32 20V32H20Z" fill="#F16A34"/>
    <path d="M32 32L44 20V32H32Z" fill="#D3511F"/>
    <path d="M20 44L32 32V44H20Z" fill="#F16A34"/>
    <path d="M32 44L44 32V44H32Z" fill="#D3511F"/>
  </svg>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-400 to-gray-500 flex items-center justify-center p-4 sm:p-8">
      {/* Main Container */}
      <div className="w-full max-w-6xl bg-[#F6F7F9] rounded-[40px] shadow-2xl overflow-hidden relative">
        
        {/* Top Header Placeholder (Check on webflow) */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-b-2xl shadow-sm z-10 font-semibold text-sm text-gray-700">
          Check on <span className="text-blue-600 italic">webflow</span>
        </div>

        {/* Section 1: Gig Share */}
        <div className="pt-24 pb-16 px-8 sm:px-16 text-center">
          <h2 className="text-4xl font-extrabold text-[#191932] mb-12">
            Work even more<br />efficiently with Gig Share
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl flex flex-col items-center hover:-translate-y-2 transition-transform duration-300">
              <div className="mb-6"><SwitchIcon /></div>
              <h3 className="text-lg font-bold text-[#191932] mb-4">Fast switching<br/>between different tools</h3>
              <p className="text-sm text-gray-500 font-medium">
                You can download documents in different file formats, import files to Evernote
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl flex flex-col items-center hover:-translate-y-2 transition-transform duration-300">
              <div className="mb-6"><FilesIcon /></div>
              <h3 className="text-lg font-bold text-[#191932] mb-4">Sending<br/>large files safely</h3>
              <p className="text-sm text-gray-500 font-medium">
                Application lets users preview PDF documents on a range of devices and supports password protection
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl flex flex-col items-center hover:-translate-y-2 transition-transform duration-300">
              <div className="mb-6"><MaterialIcon /></div>
              <h3 className="text-lg font-bold text-[#191932] mb-4">Make materials<br/>available to loved ones</h3>
              <p className="text-sm text-gray-500 font-medium">
                The app has improved support for popular PDF extensions such as Fill and Sign
              </p>
            </div>
          </div>
        </div>

        {/* Divider Image Area (simulated abstract shapes) */}
        <div className="w-full h-24 bg-[#56596E] rounded-b-[60px] relative overflow-hidden -mt-4">
          <div className="absolute right-10 -top-10 w-48 h-48 bg-[#F43838] transform rotate-45 rounded-lg opacity-90"></div>
          <div className="absolute right-32 -top-4 w-40 h-40 bg-[#DCCD9A] transform -rotate-12 rounded-lg opacity-90"></div>
          <div className="absolute left-1/2 top-4 w-48 h-12 border border-gray-400 rounded-full flex items-center justify-center text-white/50 text-sm font-semibold max-w-[200px] -translate-x-1/2">
            Up to 20 GB
          </div>
        </div>

        {/* Section 2: Processes */}
        <div className="pt-20 pb-24 px-8 sm:px-16 flex flex-col lg:flex-row items-center justify-between gap-16">
          
          <div className="lg:w-1/2 pr-0 lg:pr-12">
            <h2 className="text-5xl font-extrabold text-[#191932] leading-tight mb-6">
              Your best<br />processes
            </h2>
            <p className="text-lg text-gray-500 font-medium mb-12">
              It's a smart workspace where teams, tools and content come workspace together.
            </p>
            
            <div className="border-t border-dashed border-gray-300 pt-8 mt-8 w-full"></div>
            
            <div className="flex items-center space-x-6 sm:space-x-10 text-gray-400 opacity-80 mt-2">
              <div className="flex items-center text-xl font-serif text-[#191932] font-black tracking-tighter">
                <span className="text-2xl mr-1 leading-none">*</span>Living
              </div>
              <div className="flex items-center font-sans font-bold text-sm tracking-widest text-[#191932]">
                <div className="w-6 h-6 border-2 border-gray-400 mr-2 grid grid-cols-2 grid-rows-2">
                   <div className="border-r border-b border-gray-400"></div><div className="border-b border-gray-400"></div>
                   <div className="border-r border-gray-400"></div><div></div>
                </div>
                HOME &<br/>GARDEN
              </div>
              <div className="font-sans font-black italic text-[#191932] text-xl tracking-tight">
                book<span className="text-gray-500 font-normal">my</span>show
              </div>
              <div className="font-serif font-black text-[#191932] text-lg uppercase tracking-wide">
                Marriott
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full flex justify-end relative">
             {/* Background decorative square */}
             <div className="absolute -bottom-6 -right-6 w-full h-full bg-[#191932] rounded-[32px] opacity-10"></div>
             
             {/* Main Card */}
             <div className="bg-white rounded-[32px] p-8 shadow-2xl w-full max-w-md relative z-10">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-extrabold text-[#191932]">Niches breakdown</h3>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">...</button>
               </div>
               
               <div className="flex flex-col sm:flex-row items-center gap-6">
                 {/* Chart */}
                 <div className="relative w-[180px] h-[180px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={data}
                         innerRadius={50}
                         outerRadius={80}
                         paddingAngle={5}
                         dataKey="value"
                         stroke="none"
                       >
                         {data.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                       </Pie>
                     </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-xs text-gray-400 font-bold tracking-wider">TOTAL</span>
                     <span className="text-2xl font-black text-[#191932]">1258</span>
                   </div>
                 </div>

                 {/* Legend */}
                 <div className="w-full sm:w-auto">
                   <ul className="space-y-4">
                     {data.map((item, index) => (
                       <li key={index} className="flex items-center justify-between font-semibold text-sm">
                         <div className="flex items-center text-gray-500">
                           <span 
                             className="w-3 h-3 rounded-full mr-3 shadow-inner" 
                             style={{ backgroundColor: item.color }}
                           ></span>
                           {item.name}
                         </div>
                         <span className="text-[#191932] font-black min-w-[36px] text-right">
                           {item.name === "Engineering" ? "23%" : 
                            item.name === "Finance" ? "17%" : 
                            item.name === "Art" ? "13%" : 
                            item.name === "Social" ? "12%" : "35%"}
                         </span>
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
             </div>
             
             {/* Small dotted background decoration */}
             <div className="absolute top-1/2 -left-12 grid grid-cols-4 gap-2 opacity-20 pointer-events-none">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                ))}
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
