export const galleryCats=["Semua","Pembelajaran","Kegiatan","Prestasi","Upacara","Ekstrakurikuler"];
export const galleryData=Array.from({length:10},(_,i)=>({kat:galleryCats[1+i%5],judul:"Foto "+(i+1),foto:""}));
