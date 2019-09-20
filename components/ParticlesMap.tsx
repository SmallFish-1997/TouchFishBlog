// 粒子图背景
import Particles from 'react-particles-js'
export default () => {
  return (
    <Particles
      className="particles-container"
      params={{
        "particles": {
          "number": {
            "value": 160,
            "density": {
              "enable": false
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "speed": 4,
              "size_min": 0.5
            }
          },
          "line_linked": {
            "enable": false
          },
          "move": {
            "random": true,
            "speed": 1,
            "direction": "bottom",
            "out_mode": "out"
          }
        },
        "interactivity": {
          "events": {
            "onhover": {
              "enable": true,
              "mode": "grab"
            },
            
          },
          "modes": {
            "bubble": {
              "distance": 250,
              "duration": 2,
              "size": 0,
              "opacity": 0
            },
            "repulse": {
              "distance": 200,
              "duration": 4
            }
          }
        }
      }} />
  );
}