//Fuente sacada de: https://reactbits.dev/backgrounds/particles
import Particles from './Particles';

const FondoParticulas = () => {

    
    return <div className ="fixed inset-0 w-screen bg-blue-100 h-full -z-10 overflow-hidden">
  <Particles className ="absolute inset-0 w-full h-full"
    particleColors={["#d3e6ed"]}
    particleCount={1800}
    particleSpread={21}
    speed={0.1}
    particleBaseSize={100}
    moveParticlesOnHover
    disableRotation={false}
    pixelRatio={1}
/>
</div>
}

export default FondoParticulas
