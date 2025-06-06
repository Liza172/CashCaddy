
import {Resend} from "resend"
export async function sendEmail ({to, subject, react})
{
  const resend = new Resend(process.env.RESEND_API_KEY || "");

  try{
    const data = await resend.emails.send({
      from : "Finanace App <onboarding@resend.dev>",
      to,
      subject,
      react,
    });
    return {success : true, data};
  }catch(error){
    console.log("Faiked to send email : ", error);
    return {success : false, error};
  }
}