import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { InternshipApplication } from '../types';

export const generateAppointmentLetter = async (
  application: InternshipApplication, 
  internshipTitle: string,
  startDateString?: string,
  durationOption?: string
) => {
  // Create a temporary DOM element to render the letter
  const letterContainer = document.createElement('div');
  letterContainer.style.width = '800px';
  letterContainer.style.padding = '40px';
  letterContainer.style.fontFamily = 'Arial, sans-serif';
  letterContainer.style.position = 'absolute';
  letterContainer.style.left = '-9999px';
  letterContainer.style.top = '-9999px';
  
  // Format the current date as DD/MM/YYYY
  const currentDate = format(new Date(), 'dd/MM/yyyy');
  
  // Format start date as 1st Month Year (e.g. 1st February 2025)
  const startDate = startDateString 
    ? format(new Date(startDateString), "do MMMM yyyy")
    : format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "do MMMM yyyy");
  
  // Duration of internship (default 30 days)
  const duration = durationOption || "30 Days";
  
  // Define the image paths with the correct directory
  const logoPath = '/public/images/logo.png';
  const ceoSignPath = '/public/images/CEO-Sign.png';
  const stampPath = '/public/images/Stump.png';
  const trainingHeadSignPath = '/public/images/T-Head-Sign.png';
  const msmePath = '/public/images/msme-logo.png';
  
  // Create the letter HTML
  letterContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div style="display: flex; align-items: center;">
        <img src="${logoPath}" alt="Company Logo" style="height: 80px; margin-right: 15px;" />
        <div>
          <h1 style="margin: 0; font-size: 24px; color: #333;">ATLANTIC ENTERPRISE</h1>
          <p style="margin: 0; font-size: 14px;">Pune, Maharashtra</p>
          <p style="margin: 0; font-size: 14px;">+91-7666906951</p>
          <p style="margin: 0; font-size: 14px;">atlanticenterprise7@gmail.com</p>
        </div>
      </div>
      <div>
        <img src="${msmePath}" alt="MSME Logo" style="height: 60px;" />
      </div>
    </div>
    
    <div style="border-bottom: 2px solid #333; margin-bottom: 20px;"></div>
    
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="font-size: 22px; text-decoration: underline; margin-bottom: 5px;">INTERNSHIP OFFER LETTER</h2>
    </div>
    
    <div style="margin-bottom: 20px;">
      <p style="margin-bottom: 6px;"><strong>DATE:</strong> ${currentDate}</p>
      <p style="margin-bottom: 6px;"><strong>Dear ${application.name},</strong></p>
      <p style="margin-bottom: 6px;"><strong>College:</strong> ${application.college}</p>
    </div>
    
    <div style="margin-bottom: 20px; line-height: 1.5;">
      <p>Congratulations! We are pleased to inform you that you have been selected for the position of
      ${internshipTitle} at Atlantic Enterprise. We were impressed by your qualifications, skills, and
      enthusiasm for ${internshipTitle}, and we are excited to have you join our team.</p>
      
      <p>Below are the details of your internship program:</p>
    </div>
    
    <div style="margin-bottom: 20px; line-height: 1.5;">
      <p><strong>Program Details:</strong></p>
      <p><strong>Start Date:</strong> ${startDate}</p>
      <p><strong>Duration:</strong> ${duration}</p>
      <p><strong>Domain:</strong> ${internshipTitle}</p>
      <p><strong>Location:</strong> Work From Home (Remote)</p>
    </div>
    
    <div style="margin-bottom: 20px; line-height: 1.5;">
      <p>Hope you will be doing well. This Internship is observed by Atlantic Enterprise as
      being a learning opportunity for you. Your internship will embrace orientation and give emphasis
      on learning new skills with a deeper understanding of concepts through hands-on application of
      the knowledge you gained as an intern.</p>
      
      <p>You will acknowledge your obligation to perform all work allocated to you to the best of your
      ability within lawful and reasonable direction given to you.</p>
      
      <p>We look forward to a worthwhile and fruitful association which will make you equipped for
      future projects, wishing you the most enjoyable and truly meaningful internship program
      experience.</p>
    </div>
    
    <div style="margin-bottom: 30px;">
      <p><strong>Best Regards,</strong></p>
      <p><strong>Atlantic Enterprise</strong></p>
    </div>
    
    <div style="display: flex; justify-content: space-between; margin-top: 30px;">
      <div style="text-align: center;">
        <img src="${ceoSignPath}" alt="Signature of CEO" style="height: 60px; margin-bottom: 10px;" />
        <p style="border-top: 1px solid #333; padding-top: 5px; width: 200px;"><strong>Signature of CEO</strong></p>
      </div>
      
      <div style="text-align: center; margin-top: 10px;">
        <img src="${stampPath}" alt="Company Stamp" style="height: 80px; margin-bottom: 10px;" />
      </div>
      
      <div style="text-align: center;">
        <img src="${trainingHeadSignPath}" alt="Signature of Training Head" style="height: 60px; margin-bottom: 10px;" />
        <p style="border-top: 1px solid #333; padding-top: 5px; width: 200px;"><strong>Signature Of Training Head</strong></p>
      </div>
    </div>
    
    <div style="display: flex; margin-top: 40px; justify-content: space-between;">
      <div style="text-align: center;">
        <img src="${msmePath}" alt="MSME Logo" style="height: 60px;" />
      </div>
    </div>
  `;
  
  // Append to body temporarily
  document.body.appendChild(letterContainer);
  
  try {
    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use html2canvas to convert the HTML to a canvas
    const canvas = await html2canvas(letterContainer, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow loading of cross-origin images
      logging: false,
    });
    
    // Create a new PDF with A4 dimensions
    const pdf = new jsPDF('p', 'pt', 'a4');
    
    // A4 dimensions in pts
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate the scaling to fit the content
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
    const scaledWidth = canvasWidth * ratio;
    const scaledHeight = canvasHeight * ratio;
    
    // Add the canvas to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
    
    // Save the PDF with the applicant's name
    pdf.save(`${application.name}_Appointment_Letter.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating appointment letter:', error);
    return false;
  } finally {
    // Clean up the temporary element
    document.body.removeChild(letterContainer);
  }
}; 