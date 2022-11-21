import React, { useEffect, useState } from "react";
import { getFooterDescriptionDetail } from "../../api/service";
import parse from "html-react-parser";

// commented and modified by Ashish Dewangan on 21-11-2022
// Reason - to show footer description text from backend
// const Below = () => {
//   return (
//     <div style={{backgroundColor:"white"}}>
//     <div style={{fontSize: "16px",lineHeight: "24px",fontWeight: "600",letterSpacing: "1.2px",marginLeft:"15px",paddingTop:"15px",width:"100%"}}>
//     Timeless fashion by Designer Label R By R
//     </div>
//     <p style={{color:"#7c7c7c",margin:"15px"}}>R By R, also commonly referred to as RR, is a Delhi-based couturier, who is renowned for his iconic and glamorous fashion wear. The head-office of R By R Store is in Delhi and the flagship store of R By R is in Mehrauli.  This very talented and renowned fashion designer swears by the concept of sustainable fashion wear. His ethos reflects in his creation. He uses the most stunning recycled material to create modern silhouettes that are adorned with traditional Indian craftsmanship. The combination of the Silhouette cut, the pattern of the outfit flow, the strategic placement of the floral motifs and other elements as well as the metallic fabric makes the creation from this fashion label truly mind-blowing and a timeless fashion. Fashion seasons can come and go, but your R By R outfit will remain fashionable even after 2 decades from now and outshine the new designer wear of those times.</p>
//     <p style={{color:"#7c7c7c",margin:"15px"}}>The designer is also known for his out-of-the-box bridal collection that is a fusion of traditional and contemporary design ideas. The designer claims that since he comes from a family of engineers, Science has been a huge influencing factor in his designs. In 1999, he graduated from the National Institute of Fashion Technology and launched his fashion label. He swears by the concept of sustainability and therefore R By R label uses recycled material to create the most marvellous wearable glamour pieces. His collection uses recycled plastic, industrial materials, bindi sheets and other such recycled material that is hard to be thought of as the fabric base for fashion wear. Therefore, the fabric is the USP of the brand that makes it shine like a bright star amongst the crowd of fashion designers showcasing their collection. R By R also believes in promoting the artisans and their craft as well as their training. He encourages them to invent and innovate in order to produce meticulously worked on pieces. While watching his collection, you will get transported into the world of futuristic fashion.</p>

//     <div style={{fontSize: "16px",lineHeight: "24px",fontWeight: "600",letterSpacing: "1.2px",margin:"15px",width:"100%"}}>
//     R By R Latest Collection
//     </div>
//     <p style={{color:"#7c7c7c",margin:"15px"}}>The collection includes RR Exclusive, R By R Couture Collection, Bridal, Luxury Pret and Euphor by R By R. The designer label has a wide range of chic outfits that includes R By R Dress, Lehengas, R By R Gown collection, Jumpsuits, Skirts, Jackets, Midis, Blouses, Metallic Winged Sarees, Metallic Winged Gowns, Corded Structured Gowns, Striped Structured Gowns, Gowns with Embellished Tops, there is so much to bask your eyes with in the R By R Designer Gown collection. R By R Tops are one of the fast moving attires,  from regular Tops to Draped one-arm Tops, Cape Tops, A Symmetric High-Low Cape Tops, Nalki Embroidered Tops, Jacket Tops, Peplum Tops, Ruffled Tops, Embroidered Ruffled Tops, Tunic Tops with Bell Sleeves, Panel Tops, the list is long.</p>
//     <p style={{color:"#7c7c7c",margin:"15px"}}>Talking about R By R Lehenga collection, we assure you that you will find the most offbeat ensemble here. This collection consists of Metallic Moulded Lehenga, 3 D Metallic Lehenga,  the hand-woven versions of the Lehengas, Striped Flowy Lehenga, 3 D Embroidered Lehenga, Embroidered Cascade Lehenga, High-Low Draped Kaftan Dresses, Tunic Dress, Panel Dress, Pencil Dress, Peplum Draped Dress, Bustier clubbed with Flared Skirts, Pleated Midi Skirts, Layered Pants, Metallic Sarees with Cape, Metallic Palla Sarees, Pre-Stitched Sarees, The designer uses offbeat and regular fashion fabrics as the base of his creation, such as Tulle, Mesh Fabric, Georgette, Organza, Chiffon, Striped Fabric, Metallic finish Jersey Material, Polyester, Silk Chanderi as well as Cotton. R By R Saree collection showcases shaded shimmery fabric which enhances the glamour quotient of the overall Saree look. He also uses metallic chevron detailing in his creations. He tries to ensure that the fabric is lightweight and doesn’t feel like a burden to the wearer. He tries to stick to this rule even for his Bridal Collection. The overall look of the outfit comes out as truly awe-inspiring and dramatic.</p>

//     <div style={{fontSize: "16px",lineHeight: "24px",fontWeight: "600",letterSpacing: "1.2px",margin:"15px",width:"100%"}}>
//     Celebrities in RR    </div>
//     <p style={{color:"#7c7c7c",margin:"15px"}}>R By R is not only a hit on the fashion ramp walk but his designs are a blockbuster hit in the Bollywood circuit as well. The designer enjoys a fan-following amongst the who’s who of Bollywood Stars. Celebrities in RR list who have proudly adorned his creations are Deepika Padukone, Kiara Advani, Alia Bhatt, Shraddha Kapoor, Kriti Sanon, Sonakshi Sinha, Kalki Koechlin, Jacqueline Fernandez, Kangana Ranaut, Shobhita Dhulipala, Athiya Shetty, Ananya Pandey, Kareena Kapoor, Aditi Rao Hydari, Aishwarya Rai, Karisma Kapoor, Shilpa Shetty, Gauri Khan, Tabu, Diana Penty, Sarah Ali Khan, Parineeti Chopra, Janhvi Kapoor, Katrina Kaif, Malaika Arora,Tamannaha Bhatia, Rakul Preet Singh, Esha Gupta and Sonam Kapoor.  Even male celebrities like Ranveer Singh, Vicky Kaushal, Shahid Kapoor, Ayushman Khurana and Karan Johar have worn his Menswear creations and walked the ramp or posed for photos wearing his exclusive creation. Amit Aggarwal also has international celebrities like Priyanka Chopra, Katey Perry, Freida Pinto, Ditta Von Tessa as his admirers. You can get yourself these celebrity looks from any part of the world through Amit Aggarwal Online Store on his website. Also checkout Amit Aggarwal Designer Collection for Women..</p>

//     <div style={{fontSize: "16px",lineHeight: "24px",fontWeight: "600",letterSpacing: "1.2px",margin:"15px",width:"100%"}}>
//     R By R Online Store   </div>
//     <p style={{color:"#7c7c7c",margin:"0 15px",paddingBottom:"100px"}}>Thanks to the covid-19 pandemic induced lockdown, the designer has now adapted to the new normal and has begun creating trimmed down designs specifically for the fashion enthusiasts who are now looking for exciting fashion wear online. Through his online shopping infrastructure, the designer unveils smaller, slimmer yet as iconic collections as any of his pre-lockdown ramp show collections. You can also find Amit Aggarwal's latest collection of fashion-wear on Pernias Popup Shop</p>

// </div>
//   )
// }

const Below = () => {
  const [footerDescription, setFooterDescription] = useState([]);

  useEffect(() => {
    getFooterDescription();
  }, []);

  const getFooterDescription = async () => {
    const footerDescriptionData = await getFooterDescriptionDetail();
    if (footerDescriptionData) {
      setFooterDescription(footerDescriptionData);
    }
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      {footerDescription.length > 0 ? (
        <>
          {footerDescription.map((description) => {
            return (
              <>
                <div
                  style={{
                    fontSize: "16px",
                    lineHeight: "24px",
                    fontWeight: "600",
                    letterSpacing: "1.2px",
                    marginLeft: "15px",
                    paddingTop: "15px",
                    width: "100%",
                  }}
                >
                  {parse(description.subtitle1)}
                </div>
                <p style={{ margin: "15px" }}>{parse(description.content1)}</p>
                <div
                  style={{
                    fontSize: "16px",
                    lineHeight: "24px",
                    fontWeight: "600",
                    letterSpacing: "1.2px",
                    margin: "15px",
                    width: "100%",
                  }}
                >
                  {parse(description.subtitle2)}
                </div>
                <p style={{ margin: "15px" }}>{parse(description.content2)}</p>
                <div
                  style={{
                    fontSize: "16px",
                    lineHeight: "24px",
                    fontWeight: "600",
                    letterSpacing: "1.2px",
                    margin: "15px",
                    width: "100%",
                  }}
                >
                  {parse(description.subtitle3)}
                </div>
                <p style={{ margin: "15px" }}>{parse(description.content3)}</p>

                <div
                  style={{
                    fontSize: "16px",
                    lineHeight: "24px",
                    fontWeight: "600",
                    letterSpacing: "1.2px",
                    margin: "15px",
                    width: "100%",
                  }}
                >
                  {parse(description.subtitle4)}
                </div>
                <p
                  style={{
                    margin: "0 15px",
                    paddingBottom: "100px",
                  }}
                >
                  {parse(description.content4)}
                </p>
              </>
            );
          })}
        </>
      ) : null}
    </div>
  );
};
// End of code modification
export default Below;
