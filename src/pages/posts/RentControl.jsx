import { React, useEffect, useState } from "react";
import headerPhoto from "/src/rent_control.jpeg";
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import ScrollyTimeline, { getContentForYear } from "./RentControlTimeline2";
import ParcelMap from "./ParcelsMap";

ReactGA.initialize('G-NR2T70PVBG'); 

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

const Parcels = () => {
  const [propInfo, setPropInfo] = useState([]);

  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return (
    <div className="single">
    <div className="complexContentContainer">
      <div className="content">
        <img src={headerPhoto}></img>
        <div className="title">
          A deep dive into rent control in San Francisco
        </div>
    </div>
    <div className="content" > 
    <div >
          <p>
        San Francisco is one of the most expensive cities for renters in the United States. In February of 2025, the average rent for an apartment was $3,397 - nearly twice the national average. This cost of living is a problem for many of the approximately 65% of residents that rent. To address this crisis, many citizens and representatives argue that building new housing will increase the supply, making housing more affordable.
        </p>
        <p>
        While many support increasing thee housing supply to increase affordability, some claim that other tools must also be used to address this problem. One controversial, but well-known tool for addressing rent costs is rent control, which limits the amount that a tenant’s rent can be raised annually. 
        </p>
        <p>
        Rent control allows the city or state to directly limit the amount that a tenant’s rent can be increased, which provides additional security to tenants who might otherwise face untenable rent increases. Landlords and developers, however, argue that their return on investment woud be insufficiently low if they are unable to raise rent to align with market prices, which may disincentivize housing development. 
        </p>
        <p>
        Rent control came to the public’s attention again in the recent 2024 election with the introduction of Proposition 33, which would have given cities greater power over setting rent controls. Specifically, the proposition would have allowed cities to place rent control restrictions on certain types of housing that were previously exempt. Much like rent control itself, Proposition 33 was contentious and confusing, with both the “yes” and “no” camps arguing that their side would lead to more affordable housing. While this proposition failed, it incited further conversation of rent control, its benefits and drawbacks, and its history in San Francisco.
        </p>
        <p>The balance between prioritizing the interests of renters versus homeowners, as well as the impacts of property tax reform, underpin the way that the city has addressed housing affordability. Generally speaking, homeowner and landlord interests historically win out over renters. For example, those opposing Proposition 33, including landlord lobbying groups, spent over twice the amount as the supporters, beating the proposition. The push and pull between renters’ interests and homeowners’ interests goes far back, intensifying in the past fifty years.</p>
        <p>In the late 1970s, California Republicans had an appetite for tax reform. Homeowners saw their property taxes rise astronomically throughout the decade, cultivating support for tax relief. Howard Jarvis, a representative for several Los Angeles apartment owners,  introduced a property tax limitation measure, Proposition 13.  Jarivs’s goal was to reduce property taxes to 1% of the property’s market value, totaling between $7 - $8 billion in tax dollars annually (Willis A16). 
        </p>
        <p>Dissenters argued that this slashed the state’s annual budget, which Jarvis disregarded. Major political figures, like Governor Brown, criticized Prop. 13, calling the measure a ripoff. San Francisco Mayor Moscone said all libraries would shut down if property tax revenue was lost (Benet A1; “After Shocks of Proposition 13”). </p>
        <p>During his campaign for Proposition 13,  critics called Jarvis an agent of big business due to his ties with landlords. Jarvis pledged that his initiative would benefit apartment owners and all other taxpayers equally and stated that landlords would share property tax savings with their tenants (Javers A8). The California Housing Council, which represents 200 of the largest apartment owners in California, refuted Jarvis’s claims. The group's executive director stated that 80% of apartment landlords were not part of an association, making it difficult to control how landlords distribute property tax savings (Bartlett A7). Opponents of Proposition 13 also claimed that renters would be forced to pay additional taxes to make up for lost revenues. </p>
        <p>In June of 1978, Proposition 13 passed by a landslide. Renters moved quickly to demand rent cuts from landlords. By July, the Governor, once an adversary of Jarvis, allied with him to pressure landlords to pass on tax savings to their renters. Governor Brown, Jarvis, and landlord groups warned landlords that if they did not voluntarily comply with their requests, renters would push for local and state rent controls (Liebert P1 & P18).</p>
        <p>Without any legitimate means of reliably passing on savings from the proposition, as well as a series of "unconscionable” rent increases, tenant anger reached a fever pitch, coalescing tenant action in the Bay Area in a way never seen before.</p>
        <p>The timeline below provides an overview of this long, sometimes convoluted history of rent control, rent prices, and the complicated factors that contributed to this contentious rental market.</p>
    </div>
    <ParcelMap />
    <br /> <br />
    <p className="subtitle">
    Part 1: The Original Rent Control Debate in San Francisco
    </p>
    <div className={`timeline-marker active`}>
      <p className={`timeline-marker active`}>
        1979
        </p>
      </div>
      <p>
        { getContentForYear(1979) }
      </p>
    </div>
    <div className="content">
    <div>
        </div>
    </div>
    <div className="content"> 
    <br /> <br />
    <div className="subtitle">
    Part 2: Rent Control Throughout the 80’s - Amendments and Bans
    </div>
    <ScrollyTimeline sectionYears={[1980, 1984, 1988, 1992, 1994, 1995, 1998]}/>
    </div>
    <div className="content"> 
    <br /> <br />
    <div className="subtitle">
    Part 3: The State of Rent Control in the 21st Century
    </div>
    <ScrollyTimeline sectionYears={[2000, 2008]}/>
    </div>
    <br /> <br />
    <div className="content"> 
      <p>
    Between 2008 and 2018 no local rent control propositions or laws were passed in San Francisco or statewide. During this time the median rent in San Francisco rose from $2,041 in 2010 and $2,406 (adjusted for 2025 dollars - 84.82% increase over 8 years).
    </p>
    </div>
    <div className="content">
    <ScrollyTimeline sectionYears={[2018, 2019, 2020, 2024]}/>
    </div>
    <div className="content"> 
      <p>
      In the late 1970’s when San Francisco tenants were fighting for rent control they were impassioned by many issues of their time. The work force in San Francisco was starting to shift from blue collared workers to white collared workers, who were able to pay higher rents due to higher salaries. As white collared workers moved in, so did speculators looking to capture profits from potential higher rents, thus driving up rents for existing tenants. Many of San Francisco’s existing residents made less than $10,000 a year and there was a high percentage of elderly citizens. All of this was exacerbated by low vacancy rates and a lack of space to build new housing to meet the needs of low and moderate income tenants (Final Environmental Impact Report, Department of City Planning). 
      </p>
      <p>
      Throughout the 21st century San Francisco has faced many of the same issues the city faced in the 1970’s. The city has a high demand for housing, little space to build, high construction costs, and vast inequities between the low- and moderate- income population and white collared population. The only difference between now and then is the city has much less control over rent control laws, as do many other cities statewide.
      </p>
      <p>
      In recent years the fight over rent control has been taken to the statewide ballot many times, while the local fight has been sparse since the early 2000s. This may be a symptom of the Costa Hawkins rental housing act of 1995, which stripped away local control of regulating the rental market. This is the same act that opponents have tried to revoke in three elections over the past six years, each time failing to receive a majority of the vote.
      </p>
      <br></br>
      <br></br>
      <br></br>
      <div className="subtitle">References</div>
      <p>Willis, Doug. “State has many splitting hangovers.” <em>San Francisco Chronicle</em> [San Francisco, California], 1 Jan. 1978, p. A16. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=AMNEWS&docref=image/v2%3A142051F45F422A02%40EANX-NB-1532EE9FDCDAAD6B%402443510-15329292A478A03D%4015-15329292A478A03D%40.">Link</a></p>

<p>Kilduff, Marshall. “Housing Study Set Up.” <em>San Francisco Chronicle</em> [San Francisco, California], 17 Apr. 1979, p. A1. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=pubname%3A142051F45F422A02%21San%2BFrancisco%2BChronicle&sort=YMD_date%3AA&hide_duplicates=2&fld-base-0=alltext&maxresults=60&val-base-0=%22Feinstein%22%20%22rent%22&fld-nav-1=YMD_date&val-nav-1=1979%20-%201980&docref=image/v2%3A142051F45F422A02%40EANX-NB-15370B73E0B1BA0C%402443981-1536835BDCB6DFA3%400&origin=image/v2%3A142051F45F422A02%40EANX-NB-15370B73E0B1BA0C%402443981-1536835BF8E34F66%4015-1536835BF8E34F66%40#copy">Link</a></p>

<p>Kilduff, Marshall. “Supervisors Pleased With Rent Control Law.” <em>San Francisco Chronicle</em> [San Francisco, California], 14 Jun. 1979, p. A2. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=pubname%3A142051F45F422A02%21San%2BFrancisco%2BChronicle&sort=YMD_date%3AA&hide_duplicates=2&fld-base-0=alltext&maxresults=60&val-base-0=%22Feinstein%22%20%22rent%22&fld-nav-1=YMD_date&val-nav-1=1979%20-%201980&docref=image/v2%3A142051F45F422A02%40EANX-NB-153709E8DA9F6131%402444039-153683E51BCD5BEF%401-153683E51BCD5BEF%40">Link</a></p>

<p>Kilduff, Marshall. “S.F. Rent Law Called Inadequate.” <em>San Francisco Chronicle</em> [San Francisco, California], 26 Sep. 1979, p. A5. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=pubname%3A142051F45F422A02%21San%2BFrancisco%2BChronicle&sort=YMD_date%3AA&hide_duplicates=0&offset=61&maxresults=20&fld-base-0=alltext&val-base-0=%22Feinstein%22%20%22rent%22&fld-nav-1=YMD_date&val-nav-1=1979%20-%201980&docref=image/v2%3A142051F45F422A02%40EANX-NB-1538FF664EA0C706%402444143-1536837521D094C9%404-1536837521D094C9%40">Link</a></p>

<p>Sward, Susan. “Highrise, Rent Plans Both Defeated in S.F.” <em>San Francisco Chronicle</em> [San Francisco, California], 7 Nov. 1979, p. A1. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&sort=YMD_date%3AA&hide_duplicates=2&fld-base-0=alltext&maxresults=60&val-base-0=%22Proposition%20R%22&fld-nav-1=YMD_date&val-nav-1=1979%20-%201980&docref=image/v2%3A142051F45F422A02%40EANX-NB-153887E495715D66%402444185-153683F118078CD3%400&origin=image/v2%3A142051F45F422A02%40EANX-NB-153887E495715D66%402444185-153683F14E772FE6%4015-153683F14E772FE6%40">Link</a></p>

<p>Butler, K. et al. “The Brain Behind Defeat of Rent Control.” <em>San Francisco Chronicle</em> [San Francisco, California], 12 Nov. 1979, p. A5. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&sort=YMD_date%3AA&hide_duplicates=2&fld-base-0=alltext&maxresults=60&val-base-0=%22Proposition%20R%22&fld-nav-1=YMD_date&val-nav-1=1979%20-%201980&docref=image/v2%3A142051F45F422A02%40EANX-NB-1538880379231156%402444190-153683FC429F27B4%404-153683FC429F27B4%40">Link</a></p>

<p>Blakey, Scott. “Props. 9, 10, and 11 Lose.” <em>San Francisco Chronicle</em> [San Francisco, California], 4 Jun. 1980, p. A1. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=pubname%3A142051F45F422A02%21San%2BFrancisco%2BChronicle&sort=YMD_date%3AA&hide_duplicates=0&offset=61&maxresults=20&fld-base-0=alltext&val-base-0=%22Feinstein%22%20%22Rent%20Control%22&fld-nav-0=YMD_date&val-nav-0=1979%20-%201981&docref=image/v2%3A142051F45F422A02%40EANX-NB-1515ED1C6E763CAA%402444395-15147587400DE15F%400-15147587400DE15F%40">Link</a></p>

<p>“S.F. Rent Curbs Signed.” <em>San Francisco Chronicle</em> [San Francisco, California], 2 Sep. 1982, p. A2. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=pubname%3A142051F45F422A02%21San%2BFrancisco%2BChronicle&sort=YMD_date%3AA&hide_duplicates=2&fld-base-0=alltext&maxresults=60&val-base-0=%22S.F.%20Rent%20Curbs%20Signed%22&fld-nav-1=YMD_date&val-nav-1=Jan%201982%20-%20Dec%201982&docref=image/v2%3A142051F45F422A02%40EANX-NB-1525168A26B47EF0%402445215-151F85CBF6BFEE27%401-151F85CBF6BFEE27%40">Link</a></p>

<p>Kilduff, Marshall. “Feinstein Reluctantly Signs S.F. Rent Law.” <em>San Francisco Chronicle</em> [San Francisco, California], 3 Mar. 1982, p. A5. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=pubname%3A142051F45F422A02%21San%2BFrancisco%2BChronicle&sort=YMD_date%3AA&fld-nav-0=YMD_date&val-nav-0=1982%20-%201983&hide_duplicates=2&fld-base-0=alltext&maxresults=60&val-base-0=%22Rent%20Control%22&docref=image/v2%3A142051F45F422A02%40EANX-NB-151FD3876670C36E%402445032-151D8212C377CC68%400-151D8212C377CC68%40">Link</a></p>

<p>Kilduff, Marshall. “Vacancy Rent Control Vetoed by Feinstein.” <em>San Francisco Chronicle</em> [San Francisco, California], 20 Jan. 1984, p. A5. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=pubname%3A142051F45F422A02%21San%2BFrancisco%2BChronicle&sort=YMD_date%3AA&hide_duplicates=2&fld-base-0=alltext&maxresults=60&val-base-0=%22Harry%20Britt%22%20%22Rent%22%20Vacancy%20Control&fld-nav-1=YMD_date&val-nav-1=1983%20-%201989&docref=image/v2%3A142051F45F422A02%40EANX-NB-15309BC61F929E06%402445720-151FC61902D42A56%400&origin=image/v2%3A142051F45F422A02%40EANX-NB-15309BC61F929E06%402445720-151FC61943320507%4015-151FC61943320507%40">Link</a></p>

<p>Doyle, J.H. “Fight Builds to Kill Rent Control Curbs.” <em>San Francisco Chronicle</em> [San Francisco, California], 7 May 1987, p. A16. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=pubname%3A142051F45F422A02%21San%2BFrancisco%2BChronicle&sort=YMD_date%3AA&fld-nav-0=YMD_date&val-nav-0=1987%20-%201988&hide_duplicates=2&maxresults=60&fld-base-0=alltext&val-base-0=%22rent%20control%22&fld-nav-1=YMD_date&val-nav-1=Jan%201987%20-%20Dec%201987&docref=image%2Fv2%3A142051F45F422A02%40EANX-NB-16377FF90AA0B6EB%402446923-163769CC25335D61%4031&origin=image%2Fv2%3A142051F45F422A02%40EANX-NB-16377FF90AA0B6EB%402446923-163769CC25335D61%4031-163769CC25335D61%40">Link</a></p>

<p>San Francisco Ballot Propositions Database. Proposition U. <a href="https://sfpl.org/locations/main-library/government-information-center/san-francisco-government/san-francisco-1/san-1?title_value=&description_value=&prop_letter_value=U&month=11&year=1988">Link</a></p>

<p>Carlsen, William. “Board Limits Rent Increases in S.F. to 1.6%.” <em>San Francisco Chronicle</em> [San Francisco, California], 10 Dec. 1992, p. A21. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=pubname%3A142051F45F422A02%21San%2BFrancisco%2BChronicle&sort=YMD_date%3AA&fld-nav-0=YMD_date&val-nav-0=1992%20-%201992&hide_duplicates=2&maxresults=60&val-base-0=%22rent%20control%22&fld-base-0=alltext&fld-nav-1=YMD_date&val-nav-1=Apr%201992%20-%20Dec%201992&docref=image/v2%3A142051F45F422A02%40EANX-NB-16508A0C8E1ABE12%402448967-1650694015D64DD0%4020-1650694015D64DD0%40">Link</a></p>

<p>San Francisco Ballot Propositions Database. Proposition I. <a href="https://sfpl.org/locations/main-library/government-information-center/san-francisco-government/san-francisco-1/san-1?title_value=&description_value=&prop_letter_value=I&month=&year=1994">Link</a></p>

<p>Herman, Leta. “Rent Control Laws Change.” <em>San Francisco Chronicle</em> [San Francisco, California], 6 Sep. 1995, p. Z4. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=pubname%3A142051F45F422A02%21San%2BFrancisco%2BChronicle&sort=YMD_date%3AA&hide_duplicates=2&maxresults=60&fld-nav-0=YMD_date&val-nav-0=1995%20-%201995&val-base-0=%22rent%20control%22&fld-base-0=alltext&fld-nav-1=YMD_date&val-nav-1=Sep%201995%20-%20Dec%201995&docref=image/v2%3A142051F45F422A02%40EANX-NB-1651F81821C8B8B4%402449967-165062BFCA048BD5%4089-165062BFCA048BD5%40">Link</a></p>

<p>Gordon, Rachel. “S.F. pact on rental improvements.” <em>San Francisco Chronicle</em> [San Francisco, California], 17 Dec. 2002, p. A19. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=pubname%3A142051F45F422A02%21San%2BFrancisco%2BChronicle&sort=YMD_date%3AA&hide_duplicates=2&maxresults=60&fld-nav-0=YMD_date&val-nav-0=2002%20-%202003&val-base-0=%22rent%20control%22&fld-base-0=alltext&fld-nav-1=YMD_date&val-nav-1=Nov%202002%20-%20Dec%202002&docref=image/v2%3A142051F45F422A02%40EANX-NB-1659E28A34827C24%402452626-1657F5F67777A58D%4018&origin=image/v2%3A142051F45F422A02%40EANX-NB-1659E28A34827C24%402452626-1657F5F6A8D30B3B%4019-1657F5F6A8D30B3B%40">Link</a></p>

<p>Chorneau, Tom. “Competing Measures to Restrict Eminent Domain.” <em>San Francisco Chronicle</em> [San Francisco, California], 10 Mar. 2008, p. A16. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=pubname%3A142051F45F422A02%21San%2BFrancisco%2BChronicle&sort=YMD_date%3AA&hide_duplicates=2&maxresults=60&fld-nav-0=YMD_date&val-nav-0=2007%20-%202008&fld-base-0=alltext&val-base-0=%22rent%20control%22&fld-nav-1=YMD_date&val-nav-1=Jan%202008%20-%20Dec%202008&docref=image%2Fv2%3A142051F45F422A02%40EANX-NB-165E53FF06AF9C84%402454536-165DB66F06786CED%400&origin=image%2Fv2%3A142051F45F422A02%40EANX-NB-165E53FF06AF9C84%402454536-165DB66F60FBBBE5%4015-165DB66F60FBBBE5%40">Link</a></p>

<p>Yi, Matthew. “Prop. 99’s effect - not much.” <em>San Francisco Chronicle</em> [San Francisco, California], 5 Jun. 2008, p. 18. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=pubname%3A142051F45F422A02%21San%2BFrancisco%2BChronicle&sort=YMD_date%3AA&hide_duplicates=2&maxresults=60&fld-nav-0=YMD_date&val-nav-0=2007%20-%202008&fld-base-0=alltext&val-base-0=%22rent%20control%22&fld-nav-1=YMD_date&val-nav-1=Jun%202008%20-%20Dec%202008&docref=image/v2%3A142051F45F422A02%40EANX-NB-165E9474E03AF3D6%402454623-165DE1B4F6F44CC0%4017-165DE1B4F6F44CC0%40">Link</a></p>

<p>San Francisco Ballot Propositions Database. Proposition E. <a href="https://sfpl.org/locations/main-library/government-information-center/san-francisco-government/san-francisco-1/san-1?title_value=&description_value=&prop_letter_value=E&month=&year=1998">Link</a></p>

<p>San Francisco Ballot Propositions Database. Proposition M. <a href="https://sfpl.org/locations/main-library/government-information-center/san-francisco-government/san-francisco-1/san-1?title_value=&description_value=&prop_letter_value=M&month=&year=2008">Link</a></p>

<p>Gutierrez, Melody. “Rent control expansion defeated.” <em>San Francisco Chronicle</em> [San Francisco, California], 7 Nov. 2019, p. A8. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/openurl?ctx_ver=z39.88-2004&rft_id=info%3Asid/infoweb.newsbank.com&svc_dat=WORLDNEWS&req_dat=C4A791F4197B4BD28C27A2A6A0C93929&rft_val_format=info%3Aofi/fmt%3Akev%3Amtx%3Actx&rft_dat=document_id%3Aimage%252Fv2%253A162AD59E09CF8538%2540AWNB-16F8B9138AB97E2E%25402458430-175F003934597C13%25407-175F003934597C13%2540/hlterms%3A%2522rent%2520control%2522">Link</a></p>

<p>Koseff, Alexei. “First statewide law to protect renters signed by Newsom.” <em>San Francisco Chronicle</em> [San Francisco, California], 9 Oct. 2019, p. A1. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/openurl?ctx_ver=z39.88-2004&rft_id=info%3Asid/infoweb.newsbank.com&svc_dat=WORLDNEWS&req_dat=C4A791F4197B4BD28C27A2A6A0C93929&rft_val_format=info%3Aofi/fmt%3Akev%3Amtx%3Actx&rft_dat=document_id%3Aimage%252Fv2%253A162AD59E09CF8538%2540AWNB-17676D4F3376347F%25402458766-17676D59EAD5BA74%25400/hlterms%3A%2522rent%2520control%2522">Link</a></p>

<p>Koseff, Alexei. “Fight brewing as rent control returns to ballot.” <em>San Francisco Chronicle</em> [San Francisco, California], 5 Feb. 2020, p. A1. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/openurl?ctx_ver=z39.88-2004&rft_id=info%3Asid/infoweb.newsbank.com&svc_dat=WORLDNEWS&req_dat=C4A791F4197B4BD28C27A2A6A0C93929&rft_val_format=info%3Aofi/fmt%3Akev%3Amtx%3Actx&rft_dat=document_id%3Aimage%252Fv2%253A162AD59E09CF8538%2540AWNB-178EA719323AC947%25402458885-178EA72521CAC4E4%25400-178EA72521CAC4E4%2540/hlterms%3A%2522rent%2520control%2522">Link</a></p>

<p>Padilla, Alex. “Statement of Vote.” 3 Nov. 2020, p. 16. <a href="https://elections.cdn.sos.ca.gov/sov/2020-general/sov/complete-sov.pdf">Link</a></p>

<p>Weber, Shirley N. “Statement of Vote.” 5 Nov. 2024, p. 14. <a href="https://elections.cdn.sos.ca.gov/sov/2024-general/sov/complete-sov.pdf">Link</a></p>

<p>“Final Environmental Impact Report.” Department of City Planning, 27 Jun. 1978. <a href="https://archive.org/details/finalenvironment2719sanf">Link</a></p>

<p>Benet, Tom. “Moscone Optimistic on Saving S.F. Jobs.” <em>San Francisco Chronicle</em> [San Francisco, California], 21 Jun. 1978, p. A1. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=decade%3A1970%211970%2B-%2B1979&sort=YMD_date%3AD&hide_duplicates=2&fld-base-0=alltext&maxresults=60&val-base-0=%22Howard%20Jarvis%22%20%22libraries%22&docref=image/v2%3A142051F45F422A02%40EANX-NB-15373F660FB85EA7%402443681-1533FB1CC648D9D5%400-1533FB1CC648D9D5%40">Link</a></p>

<p>“Aftershocks of Proposition 13.” <em>San Francisco Chronicle</em> [San Francisco, California], 18 Jun. 1978, p. A1. NewsBank: America's News – Historical and Current. <a href="https://infoweb-newsbank-com.ezproxy.sfpl.org/apps/news/document-view?p=WORLDNEWS&t=decade%3A1970%211970%2B-%2B1979&sort=YMD_date%3AD&hide_duplicates=2&fld-base-0=alltext&maxresults=60&val-base-0=%22Howard%20Jarvis%22%20%22libraries%22&docref=image/v2%3A142051F45F422A02%40EANX-NB-15373F613691B8B2%402443678-1533FB0E97000459%40140-1533FB0E97000459%40">Link</a></p>

    </div>
    </div>
</div>
  );
};
export default Parcels;