let file=null;



document
.getElementById("pdfFile")
.onchange=e=>{


file=e.target.files[0];


};






document
.getElementById("compressBtn")
.onclick=async()=>{


if(!file){

alert(
"Upload PDF first"
);

return;

}



document
.getElementById("status")
.innerHTML=
"Preparing compressor...";





const level=
document
.getElementById("compressionLevel")
.value;





let settings={};



if(level==="extreme"){


settings={

dpi:72,

quality:35

};


}



if(level==="high"){


settings={

dpi:100,

quality:50

};


}



if(level==="medium"){


settings={

dpi:150,

quality:65

};


}



if(level==="low"){


settings={

dpi:200,

quality:90

};


}





document
.getElementById("status")
.innerHTML=
"Compressing PDF...";




// MuPDF WASM processing will run here


const result =
await compressWithMuPDF(
file,
settings
);




downloadPDF(result);



};








async function compressWithMuPDF(
file,
settings
){


/*

MuPDF WASM compression engine

Input:
PDF

Output:
Compressed PDF


*/


const buffer =
await file.arrayBuffer();



// MuPDF WASM API call goes here


return new Blob(
[
buffer
],
{
type:
"application/pdf"
}
);



}








function downloadPDF(blob){


const url =
URL.createObjectURL(blob);


const a =
document.createElement("a");


a.href=url;


a.download=
"compressed.pdf";


a.click();



}
