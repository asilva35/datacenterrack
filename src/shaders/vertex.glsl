// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//
vec3 mod289(vec3 x)
{
    return x-floor(x*(1./289.))*289.;
}

vec4 mod289(vec4 x)
{
    return x-floor(x*(1./289.))*289.;
}

vec4 permute(vec4 x)
{
    return mod289(((x*34.)+1.)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159-.85373472095314*r;
}

vec3 fade(vec3 t){
    return t*t*t*(t*(t*6.-15.)+10.);
}

// Classic Perlin noise, periodic variant
float pnoise(vec3 P,vec3 rep)
{
    vec3 Pi0=mod(floor(P),rep);// Integer part, modulo period
    vec3 Pi1=mod(Pi0+vec3(1.),rep);// Integer part + 1, mod period
    Pi0=mod289(Pi0);
    Pi1=mod289(Pi1);
    vec3 Pf0=fract(P);// Fractional part for interpolation
    vec3 Pf1=Pf0-vec3(1.);// Fractional part - 1.0
    vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
    vec4 iy=vec4(Pi0.yy,Pi1.yy);
    vec4 iz0=Pi0.zzzz;
    vec4 iz1=Pi1.zzzz;
    
    vec4 ixy=permute(permute(ix)+iy);
    vec4 ixy0=permute(ixy+iz0);
    vec4 ixy1=permute(ixy+iz1);
    
    vec4 gx0=ixy0*(1./7.);
    vec4 gy0=fract(floor(gx0)*(1./7.))-.5;
    gx0=fract(gx0);
    vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);
    vec4 sz0=step(gz0,vec4(0.));
    gx0-=sz0*(step(0.,gx0)-.5);
    gy0-=sz0*(step(0.,gy0)-.5);
    
    vec4 gx1=ixy1*(1./7.);
    vec4 gy1=fract(floor(gx1)*(1./7.))-.5;
    gx1=fract(gx1);
    vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);
    vec4 sz1=step(gz1,vec4(0.));
    gx1-=sz1*(step(0.,gx1)-.5);
    gy1-=sz1*(step(0.,gy1)-.5);
    
    vec3 g000=vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010=vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001=vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011=vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
    
    vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
    g000*=norm0.x;
    g010*=norm0.y;
    g100*=norm0.z;
    g110*=norm0.w;
    vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
    g001*=norm1.x;
    g011*=norm1.y;
    g101*=norm1.z;
    g111*=norm1.w;
    
    float n000=dot(g000,Pf0);
    float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
    float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));
    float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
    float n001=dot(g001,vec3(Pf0.xy,Pf1.z));
    float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
    float n011=dot(g011,vec3(Pf0.x,Pf1.yz));
    float n111=dot(g111,Pf1);
    
    vec3 fade_xyz=fade(Pf0);
    vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
    vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
    float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);
    return 2.2*n_xyz;
}

// https://github.com/dmnsgn/glsl-rotate
mat3 rotation3dY(float angle){
    float s=sin(angle);
    float c=cos(angle);
    
    return mat3(
        c,0.,-s,
        0.,1.,0.,
        s,0.,c
    );
}

vec3 rotateY(vec3 v,float angle){
    return rotation3dY(angle)*v;
}

//

precision mediump float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;
uniform float uTime;
uniform int uVertexCount;
uniform vec2 uResolution;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute float aIndex;

varying vec3 vNormal;
varying vec2 UV;

uniform float uFrequency;
uniform float uAmplitude;
uniform float uDensity;
uniform float uStrength;
uniform float uSpeed;

varying float vDistortion;

float deformation01(float x,float z,float t){
    return(sin(100./x+t*2.)*.1)+(sin(100./z+t*2.)*.1);
}

void main(){
    
    float frequency=uFrequency;
    float amplitud=uAmplitude;
    float density=uDensity;
    float strength=uStrength;
    float speed=uSpeed;
    
    speed=uTime/4.*speed;
    //frequency*=sin(uTime/4.)*8.+2.;
    //amplitud*=cos(uTime/4.)*8.+2.;
    //density*=cos(uTime/4.)*8.+2.;
    //strength*=cos(speed)*1.5+1.;
    //strength*=sin(speed)*1.5+1.;
    
    amplitud+=sin(speed/20.)*20.;
    //strength+=sin((speed-15.)/2.)+1.5;
    frequency+=sin(speed-1.7/1.13)*.68+.68;
    
    float distortion=pnoise(normal*density,vec3(10.))*strength;
    
    vec3 pos=position+(normal*distortion);
    float angle=sin(uv.y*frequency)*amplitud;
    pos=rotateY(pos,angle);
    
    vDistortion=distortion;
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
    
    vNormal=normalize(normalMatrix*normal);
    // vNormal=normalize(normalMatrix*normal);
    // vec4 modelPosition=modelMatrix*vec4(position,1.);
    
    // int vertextCount=uVertexCount;
    // float index=aIndex;
    // //modelPosition.y+=deformation01(modelPosition.x,modelPosition.z,uTime);
    // //modelPosition.y+=sin(modelPosition.x*4.+uTime*2.)*.1;
    // //modelPosition.y+=sin(modelPosition.x*100.+uTime*4.)*.5;
    // //modelPosition.y/=1.4;
    // //modelPosition.x+=sin(modelPosition.x*20.)*.5;
    
    // vec4 viewPosition=modelViewMatrix*modelPosition;
    // vec4 projectedPosition=projectionMatrix*viewPosition;
    // gl_Position=projectedPosition;
    
    UV=uv;
}