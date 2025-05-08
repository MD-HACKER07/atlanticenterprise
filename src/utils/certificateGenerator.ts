import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format, parse } from 'date-fns';
import { InternshipApplication } from '../types';
import { storeCertificateVerification, generateCertificateId } from '../services/certificateService';

export const generateInternshipCertificate = async (
  application: InternshipApplication,
  internshipTitle: string,
  startDateString?: string,
  duration?: string
) => {
  try {
    // Create a temporary DOM element to render the certificate
    const certificateContainer = document.createElement('div');
    certificateContainer.style.width = '1200px'; 
    certificateContainer.style.height = '1000px';
    certificateContainer.style.padding = '0';
    certificateContainer.style.fontFamily = 'Arial, sans-serif';
    certificateContainer.style.position = 'absolute';
    certificateContainer.style.left = '-9999px';
    certificateContainer.style.top = '-9999px';
    
    // Format the current date
    const currentDate = format(new Date(), 'MMMM d, yyyy');
    
    // Use provided start date or default to 30 days ago
    const startDate = startDateString 
      ? format(new Date(startDateString), 'MMMM d, yyyy')
      : format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'MMMM d, yyyy');
    
    // Use provided duration or default to 30 Days
    const internshipDuration = duration || '30 Days';
    
    // Get end date by adding duration to start date
    const durationNumber = parseInt(internshipDuration.split(' ')[0]);
    const durationUnit = internshipDuration.split(' ')[1].toLowerCase();
    
    let endDateObj = new Date(startDateString || Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (durationUnit.includes('day')) {
      endDateObj.setDate(endDateObj.getDate() + durationNumber);
    } else if (durationUnit.includes('month')) {
      endDateObj.setMonth(endDateObj.getMonth() + durationNumber);
    }
    
    const endDate = format(endDateObj, 'MMMM d, yyyy');
    
    // Store certificate information in the database and get a unique certificate ID
    const certificateId = await storeCertificateVerification(
      application,
      internshipTitle,
      startDateString || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      internshipDuration
    );
    
    // If storing certificate information failed, use a fallback ID
    const finalCertificateId = certificateId || generateCertificateId();
    
    // Define image paths
    const logoPath = '/images/logo.png';
    const ceoSignPath = '/images/CEO-Sign.png';
    const trainingHeadSignPath = '/images/T-Head-Sign.png';
    const stampPath = '/images/Stump.png';
    const msmePath = '/images/msme-logo.png';
    
    // Create the certificate HTML with a fresh design based on the new screenshot
    certificateContainer.innerHTML = `
      <div style="
        display: flex; 
        flex-direction: column; 
        width: 100%; 
        height: 100%;
        font-family: Arial, sans-serif;
      ">
        <!-- Outer container with everything -->
        <div style="position: relative;">
          <!-- Main container with blue outer border - CERTIFICATE ONLY -->
          <div style="
            background-color: #4da9e0;
            padding: 40px;
            width: 100%;
            box-sizing: border-box;
          ">
            <!-- White inner certificate background -->
            <div style="
              background-color: white;
              background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PGNpcmNsZSBjeD0iNSIgY3k9IjUiIHI9IjMiIGZpbGw9IiNmMGYwZjAiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuXzApIi8+PC9zdmc+');
              position: relative;
              display: flex;
              flex-direction: column;
              padding: 50px;
              box-sizing: border-box;
            ">
              <!-- Header with logo and company name -->
              <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 25px;
              ">
                <img src="${logoPath}" alt="AE" style="height: 45px; margin-right: 20px;" onerror="this.style.display='none'"/>
                <h1 style="
                  font-size: 36px;
                  color: #3498db;
                  margin: 0;
                  font-weight: bold;
                  letter-spacing: 1px;
                ">ATLANTIC ENTERPRISE</h1>
              </div>
              
              <!-- Certificate title -->
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="
                  font-size: 32px;
                  color: #2c3e50;
                  margin: 0;
                  font-weight: bold;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                ">CERTIFICATE OF COMPLETION</h1>
              </div>
              
              <!-- Certificate ID -->
              <div style="text-align: center; margin-bottom: 20px;">
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  Certificate ID: ${finalCertificateId}
                </p>
              </div>
              
              <!-- Certificate content -->
              <div style="text-align: center; font-size: 18px; color: #666; margin-bottom: 10px;">
                This is to certify that
              </div>
              
              <div style="text-align: center; margin-bottom: 15px;">
                <h2 style="
                  font-size: 36px;
                  color: #e74c3c;
                  margin: 0;
                  font-family: 'Times New Roman', serif;
                  line-height: 1.2;
                  font-weight: normal;
                ">${application.name}</h2>
              </div>
              
              <div style="text-align: center; font-size: 18px; color: #666; margin-bottom: 10px;">
                from
              </div>
              
              <div style="text-align: center; margin-bottom: 15px;">
                <h3 style="
                  font-size: 28px;
                  color: #2c3e50;
                  margin: 0;
                  line-height: 1.2;
                  font-weight: normal;
                ">${application.college && application.college !== "Not Specified" ? application.college : "Not Specified"}</h3>
              </div>
              
              <div style="text-align: center; font-size: 18px; color: #666; margin-bottom: 10px;">
                has successfully completed
              </div>
              
              <div style="text-align: center; margin-bottom: 15px;">
                <h3 style="
                  font-size: 32px;
                  color: #3498db;
                  margin: 0;
                  line-height: 1.2;
                  font-weight: normal;
                ">${internshipTitle} Internship Program</h3>
              </div>
              
              <div style="text-align: center; font-size: 18px; color: #666; margin-bottom: 10px;">
                of duration ${internshipDuration}
              </div>
              
              <div style="text-align: center; font-size: 18px; color: #666; margin-bottom: 30px;">
                from ${startDate} to ${endDate}
              </div>
              
              <!-- Verification text -->
              <div style="text-align: center; font-size: 14px; color: #777; line-height: 1.5; margin-top: auto; margin-bottom: 10px;">
                This certificate verifies that the above-named person has successfully completed the internship program at Atlantic Enterprise as
                specified above. For verification, contact us at verification@atlanticenterprise.in or visit <strong>verify.atlanticenterprise.in</strong> and enter the Certificate ID.
              </div>
              
              <!-- Issue date and MSME logo --> 
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 20px;
                margin-top: 30px;
              ">
                <div style="text-align: left; font-size: 15px; color: #666;">
                  Issued on ${currentDate}
                </div>
                <img src="${msmePath}" alt="MSME" style="height: 40px;" onerror="this.style.display='none'"/>
              </div>
            </div>
          </div>
          
          <!-- Signatures section OUTSIDE and BELOW the certificate -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 220px;
            margin-top: 30px;
          ">
            <!-- CEO Signature -->
            <div style="text-align: center;">
              <img src="${ceoSignPath}" alt="CEO Signature" style="height: 60px; width: auto;" onerror="this.style.display='none'; this.parentNode.innerHTML += '<div style=\'width: 120px; height: 50px; font-family: cursive; font-size: 16px; color: #2c3e50;\'>Signature</div>'"/>
              <p style="margin: 0; padding: 0; font-size: 13px; font-weight: bold; color: #2c3e50;">Chief Executive</p>
              <p style="margin: 0; padding: 0; font-size: 13px; font-weight: bold; color: #2c3e50;">Officer</p>
            </div>
            
            <!-- Company Stamp -->
            <div style="text-align: center;">
              <img src="${stampPath}" alt="Company Stamp" style="height: 70px; width: auto;" onerror="this.style.display='none'; this.parentNode.innerHTML += '<div style=\'width: 70px; height: 70px; border: 2px solid #3498db; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #3498db;\'>AE</div>'"/>
            </div>
            
            <!-- Training Head Signature -->
            <div style="text-align: center;">
              <img src="${trainingHeadSignPath}" alt="Training Head Signature" style="height: 60px; width: auto;" onerror="this.style.display='none'; this.parentNode.innerHTML += '<div style=\'width: 120px; height: 50px; font-family: cursive; font-size: 16px; color: #2c3e50;\'>Signature</div>'"/>
              <p style="margin: 0; padding: 0; font-size: 13px; font-weight: bold; color: #2c3e50;">Training</p>
              <p style="margin: 0; padding: 0; font-size: 13px; font-weight: bold; color: #2c3e50;">Head</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Append to body temporarily
    document.body.appendChild(certificateContainer);
    
    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Use html2canvas to convert the HTML to a canvas
    const canvas = await html2canvas(certificateContainer, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow loading of cross-origin images
      logging: false,
      allowTaint: true, // Allow tainted canvas
      backgroundColor: "#ffffff", // Set background color
    });
    
    // Create a new PDF in landscape orientation for better certificate layout
    const pdf = new jsPDF('l', 'pt', 'a4');
    
    // A4 landscape dimensions in pts
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate the scaling to fit the content
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
    const scaledWidth = canvasWidth * ratio;
    const scaledHeight = canvasHeight * ratio;
    
    // Center the certificate on the page
    const xOffset = (pdfWidth - scaledWidth) / 2;
    const yOffset = (pdfHeight - scaledHeight) / 2;
    
    // Add the canvas to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);
    
    // Save the PDF with the applicant's name
    pdf.save(`${application.name}_Internship_Certificate.pdf`);
    
    // Clean up the temporary element
    if (certificateContainer.parentNode) {
      document.body.removeChild(certificateContainer);
    }
    
    return true;
  } catch (err: any) {
    console.error('Error generating certificate:', err);
    alert(`Failed to generate certificate. Error: ${err.message || 'Unknown error'}`);
    return false;
  }
}; 