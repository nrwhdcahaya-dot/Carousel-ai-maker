export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  try{
    const {title="",body="",visual="Foto produk realistis"}=req.body||{};
    if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"OPENAI_API_KEY belum dipasang di Vercel."});
    const prompt=`Create a high-quality vertical social-media carousel image. No text, no letters, no logos, no watermark. Visual style: ${visual}. The image should visually represent this slide: Title: ${title}. Content: ${body}. Clean, attractive, commercial social media aesthetic.`;
    const r=await fetch("https://api.openai.com/v1/images/generations",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:"gpt-image-2",prompt,size:"1024x1536",n:1})});
    const d=await r.json();
    if(!r.ok) return res.status(r.status).json({error:d?.error?.message||"OpenAI image generation failed"});
    const item=d?.data?.[0];
    if(item?.b64_json) return res.status(200).json({image:`data:image/png;base64,${item.b64_json}`});
    if(item?.url) return res.status(200).json({image:item.url});
    return res.status(500).json({error:"OpenAI tidak mengembalikan gambar."});
  }catch(e){return res.status(500).json({error:e.message||"Server error"});}
}