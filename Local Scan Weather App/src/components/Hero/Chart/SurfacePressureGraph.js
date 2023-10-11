import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SurfaceGraph = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // Sample data
    const data = {
      labels: ["0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22", "24"],
      datasets: [{
        label: "Time in hours VS. Surface Pressure (in kPA)",
        // data: [87.16, 87.3, 87.31, 87.15, 86.97, 86.97, 87.08, 87.24, 87.28, 87.18, 87.07, 87.0, 87.2],
        data: [58, 47, 48, 33, 19, 43, 58, 72, 62, 35, 23, 30, 59],
        borderColor: 'orange', // Change the color of the curve
        borderWidth: 2,
        fill: false,
        cubicInterpolationMode: 'monotone',
      }]
    };

    const ctx = chartRef.current.getContext('2d');

    // Ensure that the previous chart instance is destroyed
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartRef.current.width = 100; // Set the desired width in pixels
    chartRef.current.height = 50; // Set the desired height in pixels

    // Create the chart with customized colors and font colors
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'white', // Change the color of the Y-axis grid lines
            },
            ticks: {
              color: 'white', // Change the color of the Y-axis labels
            },
          },
          x: {
            grid: {
              color: 'white', // Change the color of the X-axis grid lines
            },
            ticks: {
              color: 'white', // Change the color of the X-axis labels
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: 'white', // Change the color of the legend labels
            },
          },
        },
      },
    });

    // Clean up when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{height:"400px", marginTop: "30px"}}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default SurfaceGraph;