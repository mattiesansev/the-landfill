import React, { useEffect, useState } from "react";
import { Waypoint } from "react-waypoint";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const allData = [
  { year: 1980, label: "1980", value: 1111.86 },
  { year: 1990, label: "1990", value: 1606.10 },
  { year: 2000, label: "2000", value: 1732.40 },
  { year: 2010, label: "2010", value: 2041.00 },
  { year: 2011, label: "2011", value: 2010.77},
  { year: 2012, label: "2012", value: 2117.02},
  { year: 2013, label: "2013", value: 2057.00},
  { year: 2014, label: "2014", value: 2155.00},
  { year: 2015, label: "2015", value: 2250.09},
  { year: 2016, label: "2016", value: 2389.00},
  { year: 2017, label: "2017", value: 2407.84},
  { year: 2018, label: "2018", value: 2406.76},
  { year: 2019, label: "2019", value: 2463.26},
  { year: 2021, label: "2021", value: 2570.82},
  { year: 2022, label: "2022", value: 2535.21},
  { year: 2023, label: "2023", value: 2485.61},
]

const getDataForYear = (year) => {
  if (year === 1979) {
    return [allData[0]]
  }
  let data = []
  for (let i = 0; i < allData.length; i++) {
    const row = allData[i]
    if (row.year <= year) {
      data.push(row)
    } else {
      return data
    }
  }
  return data
}

export const getContentForYear = (year) => {
  switch (year) {
    case 1979:
      return (
        <div>
            <h2>Proposition 13: Property Tax Limitation/ People’s Initiative to Limit Property Taxation</h2>
            
            The goal of Proposition 13 was to reduce property taxes to 1% of their property’s market value, returning $7 - $8 billion in tax dollars to California taxpayers. Voters, especially homeowners who saw their property taxes rise significantly throughout the 70’s, saw Prop 13 as a lifeline. (Willis A16). To gain the support of renters, the Prop 13 campaign suggested that it would benefit apartment owners because landlords would share property tax savings with their tenants, a promise that would not materialize (Javers A8).
            <br/>
            <b>From the California Voters Pamphlet - Arguments For Proposition 13:</b>
            <br/>
            “This amendment will make rent reductions probable. Otherwise rent raises are certain as property taxes go up. It will help farmers and keep business in California. It will make home and building improvements possible and create thousands of new jobs.” - Howard Jarvis, Paul Gann (Authors of Prop 13)
            <br/>
            <b>From the California Voters Pamphlet - Arguments Against Proposition 13</b>
            <br/>
            Millions of renters will be doubly jeopardized.Renters have no guarantee that their landlord's property tax savings will be voluntarily passed through to them. But they can be certain they will be forced to pay the new or additional taxes necessary to keep our local governments out of bankruptcy. - Houston I. Flournoy (Former State Controller), Tom Bradely (Mayor of LA),, Gary Sirbu (State Chairman)
            <br/>

            <h2>Proposition U: Rent Control, Property Tax Saving</h2>
            If approved by voters, Prop U would share tax savings with renters until the end of 1979. The proposition failed, capturing 47% of the vote, and rents were not reduced. 

            <b>Temporary Rent Moratorium Measure (Kilduff A1)</b>
            <br/>
            The Board of Supervisors passed a temporary moratorium on rents for 60 days on all housing while a special housing committee studied the city's housing issues.

            <b>Rent Stabilization and Arbitration Ordinance (Kilduff A2)</b>
            <br />
            The ordinance was signed into law by Mayor Diane Feinstein in June 1979. The ordinance introduced a rent stabilization and arbitration board (rent board) to hear tenant-landlord disputes, rental caps based on the consumer price index (CPI), limited rent increases to 7% for 1980, and installed just cause evictions. 
            <br/><br />Unlike today’s updated rental ordinance, renters would have filed a complaint with the rent board to dispute rent increases (Kilduff A2). As a result, the majority of complaints came from white, middle-class neighborhoods and few came from neighborhoods like the Western Addition which was plagued by rent increases and evictions. According to Leeland Chu, a member of the rent board, “It looks like the people with the time and sophistication to work with this law are making the appeals” (Kilduff A5).
            


            <h2>Proposition R: Housing, Rent Control Revision </h2>
            To account for the limitations of San Francisco’s rent control ordinance, Proposition R was placed on the November ballot as a voter led initiative. Prop R called for tighter rent controls and had wide support throughout the city. In a surprise upset, the measure failed with 59% of voters voting no (Sward A1). One theory on why Prop. R failed to meet poll expectations due to the resources the No on R campaign had to advertise and market to voters. Allison Brenna, of the People Laws School and contributor to Prop. R, told the San Francisco Chronicle, “People didn’t know whether voting yes or no was a vote for rent control. When people don’t understand something, they tend to vote no”. 
        </div>
      )
    case 1980:
      return (
        <div>
            <h2>Proposition 10 - Rent Control Through Local Ordinance</h2>
            Less than a year after the passage of San Francisco’s rent control ordinance was passed it could have easily been banned due to the landlord backed Prop 10. This statewide measure aimed to ban existing rent control ordinances and prevent future ones from being too strict. Prop. 10 was defeated in the June 1980 election by 64.54%. According to a pollster at the time voters felt like the backers of Prop 10 were trying to bamboozle them by saying the ordinance would extend rent controls (Blakey A1).
            <br/>
        </div>
      )
    case 1984:
      return (
        <div>
            <h2>Amendments to San Francisco’s Rent Control</h2>
            In 1982, two years after the defeat of Prop 10, Mayor Feinstein extended the rent control ordinance indefinitely and required landlords to receive approval for rent hikes greater than the 7% cap (S.F Rent Curbs Signed A2; Kilduff A1). By 1984 Mayor Feinstein adjusted the rent cap to 4% - 7% of the CPI, but vetoed vacancy rent controls on vacant apartment units (Kilduff A1).
            <br/>
        </div>
      )
    case 1988:
      return (
        <div>
            <h2>Proposition U - Vacancy Rent Control</h2>
            The issue of vacancy control came up again in 1988, this time in the November election in the form of Prop U. If passed, Prop U would have amended San Francisco’s rent control ordinance to include vacant residential units. The Prop failed, only garnering 42.1% of the vote (San Francisco Ballot Propositions Database). 
            <br/>
        </div>
      )
    case 1992:
      return (
        <div>
            <h2>Proposition H - Allowable Rent Increases</h2>
            The rent control ordinance was amended to adjust the range of annual rent increases from 4% - 7% to 0% - 7% based on the CPI. Randy Shaw, head of the pro-tenant Tenderloin Housing Clinic, stated that residents supported the measure because inflation had significantly decreased since the 80’s and stated “Why should landlords get double the inflation rate?” (Carlsen, A21). 
            <br/>
        </div>
      )
    case 1994:
      return (
        <div>
            <h2>Proposition I - Rent Control</h2>
            The rent control ordinance was extended to owner-occupied buildings with four or less units (San Francisco Proposition Database).
            <br/>
        </div>
      )
    case 1995:
      return (
        <div>
            <h2>Costa Hawkins Rental Housing Act - 1995</h2>
            In a blow to rent controls across California the Costa Hawkins Rental Housing Act outlawed vacancy rent control and removed single family housing from being covered under existing rent control ordinances (Herman, Z4).
            <br/>
        </div>
      )
    case 1998:
      return (
        <div>
            <h2>Proposition E - Rent Control Exemption</h2>
            Prop E was placed on the November ballot in an effort to reverse Prop I, which placed rent controls on owner occupied apartments with four or less units. Prop E failed, with 61% of voters disapproving of it (San Francisco Ballot Database).
            <br/>
        </div>
      )
    case 2000:
      return (
        <div>
            <h2>Proposition H - Landlord, Renter Costs</h2>
            Despite benefiting from rent control, landlords could pass 10% of capital improvement cost onto their renters over ten years. Prop H asked renters whether “pass-throughs” of costs from landlords to tenants should be limited, and voters overwhelmingly voted yes. Although Prop H passed, a superior court blocked it from going into effect until landlords and tenants worked out an agreement to spread out improvement costs - this was accomplished by 2002 (Gordon A19). 
            <br/>
        </div>
      )
    case 2008:
      return (
        <div>
            <h2>Proposition 98 - Eminent Domain and Rent Control Prohibition Amendment of Harassment of Tenants by Landlords</h2>
            Co-sponsored by the Howard Jarvis Taxpayers Association, Prop 98’s purpose was to phase out all rent control laws across the state. Supporters of the prop stated that rent controls are a violation of property rights and their goal was to give more autonomy back to landlords; opponents stated that the prop was being used to repeal all rent controls (Chorneau, A16). Voters throughout the state decidedly shot down Prop 98, with the prop receiving only 39% of the vote (Yi, A18).
            <br/>
            <h2>Proposition M - Changing the Residential Rent Ordinance to Prohibit Specific Acts</h2>
            Prop M passed, adding an amendment to the rent control ordinance protecting tenants from specific acts of landlord harassment and enforcement through criminal penalties (San Francisco Ballot Propositions Database).
        </div>
      )
    case 2018:
      return (
        <div>
            <h2>Proposition 10 - Local Rent Control Initiative</h2>
            Prop 10 would have allowed local governments to apply rent control laws to any type of rental housing, appealing the Costa-Hawkins Rent Housing Act of 1995. California voters widely opposed the initiative, with 59.43% of the population voting no. One of the largest proponents of Prop. 10 was the AIDS healthcare foundation - the organization has been one of the largest proponents of rent control Props since (Gutierrez A8).
        </div>
      )
    case 2019:
      return (
        <div>
            AB1482 imposed the first-ever statewide cap on rent increases - the bill limited rent increases to 5% plus the regional cost of living increase or a max of 10% a year. The bill does not cover apartment buildings built within the last 15 years, single family homes or condos unless they are owned by a corporation, and duplexes where the owner lives in a unit (Koseff A1).
        </div>
      )
    case 2020:
      return (
        <div>
          <h2>Proposition 21 - The rental affordability act</h2>
          Sponsored by the AIDS Healthcare foundation, Prop 21 asked voters if local governments should be able to expand rent control to newer buildings, single-family homes, and apartments vacated by tenants (Koseff A1). In an outcome nearly identical to 2018’s Prop. 10, voters rejected the measure to expand rent controls 59.9% to 40.1% (Padilla, P14)
        </div>
      )
    case 2024:
      return (
        <div>
          <h2>Proposition 33 - Prohibit State Limitations on Local Rent Control Initiative</h2>
          Again called for the repeal of Costa-Hawkins Rental Housing Act of 1995 and was sponsored by the AIDS Healthcare foundation (Roy A1). Prop 33 fared worse than its two predecessors, only receiving 40% of the vote (Weber p14).
        </div>
      )
  }
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

function TimelineMobileView({sectionYears}) {
  const [data, setData] = useState(getDataForYear(sectionYears[sectionYears.length - 1]));

  const tickColor = 'black'
  const chartHeight = 300

  return (
  <div className="container">
        <div className="chart-title">Median gross rent</div>
        <div className="chart-description">(Adjusted for 2025 inflation)</div>
        <ResponsiveContainer width="100%" height={chartHeight} className="chartContainer">
      <BarChart data={data}>
        <XAxis dataKey="label" tick={{ fill: tickColor}} />
        <YAxis tick={{ fill: tickColor }}/>
        <Tooltip
        contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #ccc",
            borderRadius: "8px",
        }}
        cursor={false}
        labelStyle={{ color: "black"}}
        itemStyle={{ color: "black" }}
        formatter={(value) => `$${[value]}`}
        />
        <Bar dataKey="value" fill="#131140"/>
      </BarChart>
      </ResponsiveContainer>
        {sectionYears.map((year) => (
          <section key={year} className="year-section">
            <div className={`timeline-marker active`}>
              {year}
            </div>
            <p>
              { getContentForYear(year) }
            </p>
          </section>
        ))}
    </div>
  );
}
export default function ScrollyTimeline({sectionYears}) {
  const [data, setData] = useState(getDataForYear(sectionYears[0]));
  const [activeYear, setActiveYear] = useState(sectionYears[0]);
  const isMobile = useIsMobile();

  const tickColor = 'black'
  const chartHeight = isMobile ? 200 : 300
  const topOffset = isMobile ? undefined : "10%"
  const bottomOffset = isMobile ? "100px" : "80%"

  if (isMobile) {
    return <TimelineMobileView sectionYears={sectionYears} />
  }
  return (
    <div className="container">
      <div className="right-column">
        <div className="chart-title">Median gross rent</div>
        <div className="chart-description">(Adjusted for 2025 inflation)</div>
        <ResponsiveContainer width="100%" height={chartHeight} className="chartContainer">
          <BarChart data={data}>
            <XAxis dataKey="label" tick={{ fill: tickColor}} />
            <YAxis tick={{ fill: tickColor }}/>
            <Tooltip
            contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ccc",
                borderRadius: "8px",
            }}
            cursor={false}
            labelStyle={{ color: "black"}}
            itemStyle={{ color: "black" }}
            formatter={(value) => `$${[value]}`}
            />
            <Bar dataKey="value" fill="#131140"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="left-column">
        {sectionYears.map((year) => (
          <section key={year} className="year-section">
            <Waypoint
              onEnter={() => {
                setActiveYear(year);
                setData(getDataForYear(year));
              }}
              topOffset={topOffset}
              bottomOffset={bottomOffset}
            />
            <div className={`timeline-marker ${activeYear === year ? "active" : ""}`}>
              {year}
            </div>
            <p>
              { getContentForYear(year) }
            </p>
          </section>
        ))}
      </div>
      
    </div>
  );
}
