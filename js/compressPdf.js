// ============================
// COMPRESS PDF TOOL
// ============================

let compressFile = null;


// UI

function compressPDFUI(){

return `

<h1>📦 Compress PDF</h1>


<div class="dropzone" id="compressDropzone">

<h3>Upload PDF File</h3>

<p>
Click or Drag & Drop PDF Here
</p>

<div class="formats">
Supported: PDF only
</div>

</div>



<input 
type="file"
id="compressInput"
accept="application/pdf"
style="display:none">



<div id="compressInfo"></div>


<br>


<h3>Compression Quality</h3>


<label>
<input 
type="radio"
name="compressQuality"
value="high"
checked>

High Quality

</label>


<br>


<label>
<input 
type="radio"
name="compressQuality"
value="medium">

Medium Quality

</label>


<br>


<label>
<input 
type="radio"
name="compressQuality"
value="low">

Low Quality

</label>


<br><br>


<button 
class="convert-btn"
id="compressBtn">

Compress PDF

</button>


<div id="compressStatus"></div>


`;

}



// Initialize

function initCompressPDF(){


const dropzone =
document.getElementById("compressDropzone");


const input =
document.getElementById("compressInput");


const button =
document.getElementById("compressBtn");



if(!dropzone) return;



dropzone.onclick=()=>{

input.click();

};



input.onchange=()=>{

compressFile=input.files[0];

showCompressInfo();

};




button.onclick=()=>{


if(!compressFile){

alert("Please select PDF");

return;

}


compressPDF(compressFile);


};


}





function showCompressInfo(){


document.getElementById("compressInfo").innerHTML=`

<div class="file-item">

${compressFile.name}

<br>

Size:
${(compressFile.size/1024/1024).toFixed(2)} MB

</div>

`;

}





async function compressPDF(file){


try{


document.getElementById("compressStatus").innerHTML=
"⏳ Compressing...";



const bytes =
await file.arrayBuffer();



const pdf =
await PDFLib.PDFDocument.load(bytes);



const pdfBytes =
await pdf.save({

useObjectStreams:true

});



downloadPDF(
pdfBytes,
"compressed.pdf"
);



document.getElementById("compressStatus").innerHTML=

`

<p style="color:green">

✅ Compression Completed

</p>

`;


}


catch(error){


console.error(error);

alert("Compression failed");


}


}
