export default function CompanyInformation(props: any){
    const StockCompanyDetails = props.StockCompanyDetails
    return (
        <article className='CompanyInfoDisplayed'>
                      <div className='Description'>
                        <h3>Description</h3> 
                        <p>{StockCompanyDetails?.description != null ? StockCompanyDetails?.description : "Limited API Plan doesnt allow me to get the data"}</p>
                    </div>
                    <div className='StockDetailsContainer'>
                      <div className='StockDetailsColumnOne'>
                      <p className='StockDetailsTableData'>CEO: <p>{StockCompanyDetails?.ceo  != null ? StockCompanyDetails?.ceo : "Unavailable"}</p></p>
                      <p className='StockDetailsTableData'>Sector: <p>{StockCompanyDetails?.sector != null ? StockCompanyDetails?.sector : "Unavailable"}</p></p>
                      </div>
                      <div className='StockDetailsColumnTwo'>
                      <p className='StockDetailsTableData'>Exchange: <p>{StockCompanyDetails?.exchange != null ? StockCompanyDetails?.exchange : "Unavailable"}</p></p>
                      <p className='StockDetailsTableData'>Industry: <p>{StockCompanyDetails?.industry != null ? StockCompanyDetails?.industry : "Unavailable"}</p></p>
                      </div>
                      <div className='StockDetailsColumnThree'>
                        <p className='StockDetailsTableData'>Mic Code: <p>{StockCompanyDetails?.micCode != null ? StockCompanyDetails?.micCode : "Unavailable"}</p></p>
                        <p className='StockDetailsTableData'>Type: <p>{StockCompanyDetails?.type != null ? StockCompanyDetails?.type : "Unavailable"}</p></p>
                      </div>
                      <div className='StockDetailsColumnFour'>
                      <p className='StockDetailsTableData'>Employees: <p>{StockCompanyDetails?.employees != null ? StockCompanyDetails?.employees : "Unavailable"}</p></p>
                            <p className='StockDetailsAddress'><p>Address: </p>
                            {StockCompanyDetails?.address != null ? 
                                <>
                                  {StockCompanyDetails?.address} <br />
                                  {StockCompanyDetails?.address2} {StockCompanyDetails?.address2 == null ? <br /> : ""} 
                                  {StockCompanyDetails?.city} <br /> 
                                  {StockCompanyDetails?.zip + " " + StockCompanyDetails?.state} <br /> 
                                  {StockCompanyDetails?.country}
                                </>
                              : "Unavailable"}
                            </p>
                              
                      </div>
                      <div className='StockDetailsColumnFive'>
                      <p className='StockDetailsTableData'> Website: <a href={StockCompanyDetails?.website}>{StockCompanyDetails?.website != null ? StockCompanyDetails?.website : "Unavailable"}</a></p>
                      <p className='StockDetailsTableData'> Phone: <p>{StockCompanyDetails?.phone != null ? StockCompanyDetails?.phone : "Unavailable"}</p></p>
                      </div>
                    </div>
                  </article>
    )
}