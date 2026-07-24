async function compressPDF(){


const file =
document.getElementById("compressFile").files[0];


if(!file){

alert("Please select PDF");

return;

}



document.getElementById("status").innerHTML =
"Compressing...";



const bytes =
await file.arrayBuffer();



const pdf =
await PDFLib.PDFDocument.load(bytes);



const compressed =
await pdf.save({

useObjectStreams:true

});



const blob =
new Blob(
[compressed],
{
type:"application/pdf"
}
);



const link =
document.createElement("a");


link.href =
URL.createObjectURL(blob);


link.download =
"compressed.pdf";


link.click();



document.getElementById("status").innerHTML =
"✅ Completed";


}
