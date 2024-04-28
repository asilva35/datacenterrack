precision mediump float;

uniform float uOpacity;
uniform float uDeepPurple;
uniform vec3 uBrightness;
uniform vec3 uContrast;
uniform vec3 uOscilation;
uniform vec3 uPhase;
uniform float uTime;
uniform float uSpeed;

varying float vDistortion;

vec3 cosPalette(float t,vec3 a,vec3 b,vec3 c,vec3 d){
    return a+b*cos(6.28318*(c*t+d));
    
}

void main(){
    float distort=vDistortion*3.;
    
    //vec3 brightness=vec3(0.,0.,0.);
    vec3 brightness=uBrightness;
    //vec3 contrast=vec3(0.,0.,0.);
    vec3 contrast=uContrast;
    //vec3 oscilation=vec3(0.,0.,0.);
    vec3 oscilation=uOscilation;
    //vec3 phase=vec3(0.,0.,0.);
    vec3 phase=uPhase;
    
    float speed=uSpeed;
    speed=uTime/4.*speed;
    
    contrast.r=sin(speed-.5)*.5+.5;
    contrast.g=sin(speed-1.5)*.5+.5;
    
    vec3 color=cosPalette(distort,brightness,contrast,oscilation,phase);
    
    gl_FragColor=vec4(color,vDistortion);
    gl_FragColor+=vec4(min(uDeepPurple,1.),0.,.5,min(uOpacity,1.));
    //gl_FragColor+=vec4(min(uDeepPurple,1.),0.,.5,1.);
    
}

// precision mediump float;
// varying vec3 vNormal;

// void main(){
    //     vec3 color=vec3(255./255.,255./255.,9./255.);
    //     //color*=dot(vNormal,vec3(213./255.,172./255.,255./255.));
    //     //gl_FragColor=vec4(color,1.);
    //     gl_FragColor=vec4(vNormal,1.);
// }