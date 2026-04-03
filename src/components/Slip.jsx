import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export const Slip = React.forwardRef(({ data }, ref) => {
    // Dynamic sizing logic
    const rowCount = data.measurements.length + 1; // +1 for header
    // Available height for table roughly 6.5cm (taking into account padding) ~ 245px
    const availableHeightPx = 245;
    const rowHeightPx = Math.min(25, availableHeightPx / rowCount); // Max 25px height
    const fontSizePx = Math.max(8, Math.min(10, rowHeightPx * 0.6)); // Min 8px, Max 10px, or scaled

    return (
        <div ref={ref} className="w-[25cm] h-[7cm] bg-white text-black flex text-[10px] leading-tight font-sans overflow-hidden border border-gray-100 dark:border-[#334155] box-border p-2 print:border-none print:w-[25cm] print:h-[7cm] print:overflow-hidden dark:shadow-[0_0_20px_rgba(0,100,255,0.15)] transition-shadow">
            {/* Left Metadata Section - Rotated Text */}
            <div className="w-[2.5cm] h-full relative border-r border-gray-400 mr-2 flex-shrink-0">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap flex flex-col gap-1 text-[10px] font-semibold text-gray-800 items-center justify-center"
                    style={{ width: '7cm', height: '2.5cm' }}
                >
                    <span>Date: {data.date}</span>
                    <span>Name: {data.name}</span>
                    <span>Design No : {data.designNo}</span>
                    <span>Serial Count: {data.serialCount}</span>
                    <span>Print Date : {data.printDate}</span>
                </div>
            </div>

            {/* Diagram Section */}
            <div className="w-[4cm] h-full flex flex-col items-center justify-center border-r border-gray-400 pr-2 mr-2">
                <div className="relative w-full h-full flex items-center justify-center pt-2">
                    {data.diagramImage && <img src={data.diagramImage} alt="Diagram" className="h-[90%] w-auto object-contain" />}
                </div>
            </div>

            {/* QR Code Section */}
            <div className="w-[3.5cm] h-full flex items-center justify-center border-r border-gray-400 pr-2 mr-2">
                <QRCodeCanvas value={JSON.stringify((({ diagramImage, ...rest }) => rest)(data))} size={110} />
            </div>

            {/* Table Section */}
            <div className="flex-1 h-full overflow-hidden flex items-center">
                <table className="w-full border-collapse" style={{ fontSize: `${fontSizePx}px` }}>
                    <thead>
                        <tr className="bg-gray-200 text-center" style={{ height: `${rowHeightPx}px` }}>
                            <th className="border border-gray-600 px-1">ID</th>
                            <th className="border border-gray-600 px-1">Range</th>
                            <th className="border border-gray-600 px-1">Actual</th>
                            <th className="border border-gray-600 px-1">Diff</th>
                            <th className="border border-gray-600 px-1">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.measurements.map((row, i) => (
                            <tr key={i} className={`text-center ${row.status === 'NG' ? 'font-bold' : ''}`} style={{ height: `${rowHeightPx}px` }}>
                                <td className="border border-gray-600 px-1 font-bold">{row.id}</td>
                                <td className="border border-gray-600 px-1 whitespace-nowrap">{row.spec}</td>
                                <td className="border border-gray-600 px-1">{row.actual}</td>
                                <td className="border border-gray-600 px-1">{row.diff}</td>
                                <td className="border border-gray-600 px-1">{row.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

Slip.displayName = 'Slip';
