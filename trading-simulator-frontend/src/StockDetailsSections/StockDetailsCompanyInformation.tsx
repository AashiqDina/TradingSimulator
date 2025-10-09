import axios from "axios";
import { useEffect, useState } from "react"
import { CompanyProfile } from "../interfaces";
import AiLoading from "../AiLoading";

export default function CompanyInformation(props: any){
    const StockCompanyDetails = props.StockCompanyDetails
    const [descSeeMore, setdescSeeMore] = useState(false)

  useEffect(() => {
    async function GetCompanyDetailsfromApi(){
      if(props.DisplayedData == "CompanyInformation" && StockCompanyDetails == null){
        const response = await axios.get<{profile: CompanyProfile}>(`http://localhost:3000/api/stocks/GetCompanyDetails/${props.symbol}`);
        console.log("Company Details:", response.data)
        props.setCompanyDetails(response.data.profile)
      }
    }
    GetCompanyDetailsfromApi()
  }, [props.DisplayedData])

  const Loading = props.DisplayedData == "CompanyInformation" && !StockCompanyDetails;
  let modArray = undefined
  if(StockCompanyDetails){
    modArray = StockCompanyDetails.description.slice(0, 250)
  } 

  const companyFields: { label: string; value?: keyof CompanyProfile; custom?: (c: CompanyProfile) => string }[] = [
    { label: "Exchange", value: "exchange" },
    { label: "Industry", value: "industry" },
    { label: "Sector", value: "sector" },
    { label: "Type", value: "type" },
    { label: "CEO", value: "ceo" },
    { label: "Employees", value: "employees" },
    { label: "Website", value: "website" },
    { label: "Phone", value: "phone" },
    {
      label: "Address",
      custom: (c) =>
        `${c.address ?? ""}, ${c.city ?? ""}, ${c.state ?? ""} ${c.zip ?? ""}, ${c.country ?? ""}`,
    },
  ];

      return (
      <>
      {!Loading || StockCompanyDetails == null ? <article className='CompanyInfoDisplayed'>
        <div className="Desc">
            {StockCompanyDetails && <h2>Description</h2>}
            {StockCompanyDetails ? (
              <>
                {descSeeMore 
                  ? StockCompanyDetails.description 
                  : `${modArray}...`}
                {StockCompanyDetails.description.length > 250 && (
                  <span
                    style={{color: '#45a049', cursor: 'pointer', marginLeft: '4px'}}
                    onClick={() => setdescSeeMore(!descSeeMore)}
                  >
                    {descSeeMore ? 'See less.' : 'See more.'}
                  </span>
                )}
              </>
            ) : props.symbol === "AAPL" ? (
              "An Error has Occurred"
            ) : (
              "Due to restrictions in the Twelve Data API’s free tier, this section’s data is only available for Apple."
            )}
          </div>
          <div className="CompInfoTable">
            {companyFields.map((field, i) => (
              <div key={i} className="Row">
                <h4>{field.label}</h4>
                {field.label != "Website" && <p>
                  {field.value
                    ? StockCompanyDetails?.[field.value] ?? "—"
                    : StockCompanyDetails ? field.custom?.(StockCompanyDetails) : "—"}
                </p>}
                {field.label == "Website" && <a href={field.value ? StockCompanyDetails?.[field.value] : undefined}>
                    {field.value ? StockCompanyDetails?.[field.value] : undefined}
                </a>}
              </div>
            ))}
          </div>
      </article> : <AiLoading/>}
      </>
       //       {!Loading || StockCompanyDetails == null ? <article className='CompanyInfoDisplayed'>
        //   <div className="Description">
        //     <h2>Description</h2>
        //     <div>{(StockCompanyDetails != null) ? 
        //       descSeeMore ? StockCompanyDetails.description 
        //       : modArray + "... seem" 
        //       : props.symbol == "AAPL" ? "An Error has Occured" 
        //       :  "Due to restrictions in the Twelve Data API’s free tier, this section’s data is only available for Apple."}
        //     </div>
        //   </div>
        //   <div>
        //     <table>
        //       <td></td>
        //     </table>
        //     <table>
        //       <td></td>
        //     </table>
        //   </div>               
        // </article> : <AiLoading/>}
    )
}