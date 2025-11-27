// Web3Particles.jsx

import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // hoặc loadFull

const particlesConfig = {
  // Cấu hình Cyber-Modern/Web3 Style
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse", // Hạt bị đẩy ra khi hover
      },
      onClick: {
        enable: true,
        mode: "push", // Tạo thêm hạt khi click
      },
      resize: true,
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4,
      },
      push: {
        quantity: 4,
      },
    },
  },
  particles: {
    number: {
      value: 100, // Số lượng hạt
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#00e6e6", // Màu Cyan (Primary Glow)
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
      },
    },
    size: {
      value: 1, // Kích thước hạt nhỏ
      random: true,
      anim: {
        enable: false,
      },
    },
    links: {
      // Các đường nối giữa các hạt (tạo hiệu ứng mạng lưới)
      enable: true,
      distance: 150,
      color: "#e600e6", // Màu Magenta (Secondary Glow)
      opacity: 0.2,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1, // Tốc độ di chuyển chậm
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  detectRetina: true,
  background: {
    // Không cần nền vì đã được container xử lý
    color: {
      value: "transparent",
    },
  },
};

const Web3Particles = () => {
  const particlesInit = useCallback(async (engine) => {
    // Chỉ tải các module cần thiết (slim) để tối ưu hiệu suất
    await loadSlim(engine);
  }, []);

  // particlesLoaded được sử dụng khi các hạt đã tải xong
  // const particlesLoaded = useCallback(async (container) => {
  //   console.log(container);
  // }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      // loaded={particlesLoaded}
      options={particlesConfig}
    />
  );
};

export default Web3Particles;
