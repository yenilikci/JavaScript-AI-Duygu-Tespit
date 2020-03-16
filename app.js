//sabit video değişkeni:
const video = document.getElementById("video");

//bütün modellerin yüklenmei:
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"), //yüz tanıma
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"), //yüz işaretleme
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"), //tüz tanıma
  faceapi.nets.faceExpressionNet.loadFromUri("/models") //duygularımı anlama
]).then(kamerayiAc());//yüklendiğinde kamerayı aç


//kamerayı açmak için:  
function kamerayiAc()
{
  navigator.getUserMedia(
    {
      video: {}
    },
          stream => (video.srcObject = stream),
          err => console.log(err)
  );
}

//video çalıştığında yüz tanımayı entegre et:
video.addEventListener("play", () => {

  //canvas tanımlaması:
  const canvas  = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);//dökümana canvas objesinin eklenmesi
  const boxSize = {
    width: video.width, //video genişliği kadar
    height: video.height //video yüksekliği kadar
  };

  //görüntü ile kutu ölçülerini eşleştir.
  faceapi.matchDimensions(canvas,boxSize);

  setInterval(async() => {
    //async
    const tespitler = await faceapi
        //tüm yüzleri tespit et
        .detectAllFaces(video,new faceapi.TinyFaceDetectorOptions()) //kurucu olarak verdik
        .withFaceLandmarks() //FaceLandmarks ile birlikte tespit et.
        .withFaceExpressions();
      canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height); //x,y,w,h

    //tespit edilen yüzlerin alınması:
    const tespitBoyutlandır = faceapi.resizeResults(tespitler,boxSize); //boxSize objesi

    //canvas entegresi , canvas'a sonuçları yazdır:
    faceapi.draw.drawDetections(canvas,tespitBoyutlandır);

    faceapi.draw.drawFaceLandmarks(canvas,tespitBoyutlandır);

    faceapi.draw.drawFaceExpressions(canvas,tespitBoyutlandır);

    },100) //100 milisaniyede bir
})


