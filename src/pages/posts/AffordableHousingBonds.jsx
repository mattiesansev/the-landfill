import { useState } from "react";
import AffordableHousingBondMap from "./monthlyRoundup/AffordableHousingBondMap";
import { BOND_PROJECTS } from "./monthlyRoundup/affordableHousingBondData";

const DISTRICTS = [...new Set(BOND_PROJECTS.map((p) => p.district))].sort((a, b) => a - b);

const AffordableHousingBonds = () => {
  const [district, setDistrict] = useState(null);
  const shown = district ? BOND_PROJECTS.filter((p) => p.district === district) : BOND_PROJECTS;
  const supervisor = district ? shown[0]?.supervisor : null;

  return (
    <div className="ahb-page">
      <h1 className="ahb-page-title">Where SF's Affordable Housing Bond Money Is Going</h1>
      <p className="ahb-page-dek">
        Projects receiving funds from the city's most recent affordable housing bond issuances.
        Click a star to learn about each project.
      </p>

      <div className="ahb-district-filter" role="group" aria-label="Filter by supervisor district">
        <button className={district === null ? "active" : ""} onClick={() => setDistrict(null)}>
          All districts
        </button>
        {DISTRICTS.map((d) => (
          <button key={d} className={district === d ? "active" : ""} onClick={() => setDistrict(d)}>
            District {d}
          </button>
        ))}
      </div>

      <AffordableHousingBondMap district={district} />

      <p className="ahb-page-summary">
        {district ? `District ${district} (${supervisor}): ` : "Citywide: "}
        {shown.length} bond-funded project{shown.length === 1 ? "" : "s"}.
      </p>

      <p className="ahb-page-source">
        Source: Mayor's Office of Housing and Community Development (MOHCD) bond issuance data.
      </p>
    </div>
  );
};

export default AffordableHousingBonds;
