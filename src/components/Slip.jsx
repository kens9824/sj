import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export const Slip = React.forwardRef(({ data }, ref) => {
    // Helper to chunk measurements into groups of 12
    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    const maxRowsPerTable = 12;
    const measurementChunks = chunkArray(data.measurements, maxRowsPerTable);
    
    // Dynamic sizing to fill space
    const rowsInView = Math.min(data.measurements.length, maxRowsPerTable);
    const rowHeightPx = Math.floor(255 / (rowsInView + 1)); 
    const fontSizePx = Math.max(9, Math.min(11, rowHeightPx * 0.45));

    return (
        <div ref={ref} className="w-[23cm] h-[8.2cm] bg-white text-black flex text-[10px] leading-tight font-sans overflow-hidden box-border p-1 border border-gray-300 dark:border-gray-600 print:border-none print:w-[24.5cm] print:h-[7.2cm] print:overflow-hidden print: dark:shadow-[0_0_20px_rgba(0,100,255,0.15)] transition-shadow">
            {/* Left Metadata Section - Rotated Text */}
            <div className="w-[1cm] h-full relative border-r border-gray-400 flex-shrink-0 bg-gray-50/50 self-stretch">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap flex flex-col gap-1 text-[9px] font-semibold text-gray-800 items-center justify-center p-2"
                    style={{ width: '5.2cm' }}
                >
                    <span className="flex gap-2"><span>Date: {data.date}</span> <span>Print Date: {data.printDate}</span></span>
                    <span className="flex gap-2"><span>Name: {data.name}</span>
                     {/* <span>Design No: {data.designNo}</span> */}
                     </span>
                    {/* <span>Serial Count: {data.serialCount}</span> */}
                </div>
            </div>

            {/* Diagram Section */}
            <div className="w-[6cm] h-full flex flex-col items-center justify-center border-r border-gray-400 p-2 flex-shrink-0">
                <div className="relative w-full h-full flex items-center justify-center">
                    {data.diagramImage && <img src={data.diagramImage} alt="Diagram" className="h-full w-auto object-contain" />}
                </div>
            </div>

            {/* Table(s) Section */}
            <div className="flex-1 h-full overflow-hidden flex items-stretch gap-1 p-1">
                {measurementChunks.map((chunk, chunkIdx) => (
                    <table key={chunkIdx} className="flex-1 border-collapse border border-gray-400 h-full" style={{ fontSize: `${fontSizePx}px` }}>
                        <thead>
                            <tr className="bg-gray-200 text-center font-bold" style={{ height: `${rowHeightPx}px` }}>
                                <th className="border border-gray-400 px-0.5 w-[10%]">ID</th>
                                <th className="border border-gray-400 px-0.5 w-[40%]">Range</th>
                                <th className="border border-gray-400 px-0.5 w-[15%]">Actual</th>
                                <th className="border border-gray-400 px-0.5 w-[15%]">Diff</th>
                                <th className="border border-gray-400 px-0.5 w-[10%]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="h-full">
                            {chunk.map((row, i) => (
                                <tr key={i} className={`text-center ${row.status === 'NG' ? 'bg-red-50 font-bold' : (i % 2 === 0 ? 'bg-white' : 'bg-gray-50/10')}`} style={{ height: `${rowHeightPx}px` }}>
                                    <td className="border border-gray-400 px-0.5 font-bold">{row.id}</td>
                                    <td className="border border-gray-400 px-0.5 whitespace-nowrap">{row.spec}</td>
                                    <td className="border border-gray-400 px-0.5">{row.actual}</td>
                                    <td className="border border-gray-400 px-0.5">{row.diff}</td>
                                    <td className={`border border-gray-400 px-0.5 ${row.status === 'NG' ? 'text-red-600 font-bold' : 'text-black-600'}`}>{row.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ))}
            </div>
        </div>
    );
});

Slip.displayName = 'Slip';
