import Test3D from '@/components/Models3D/Test3D';

export default function Test3DScreen() {
  return (
    <>
      <Test3D />
      <div
        id="infoPoint"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#0000FF',
          transform: 'translate(-50%,-50%)',
        }}
      ></div>
    </>
  );
}
