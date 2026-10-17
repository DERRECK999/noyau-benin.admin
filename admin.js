const reportData = {
  1: { label: "Septembre — Octobre 2026", visits: 4820, deals: 31, commission: 1004400, listings: 248, change: "6,4 %", months: ["17 sept.", "24 sept.", "1 oct.", "8 oct.", "17 oct."] },
  3: { label: "Août — Octobre 2026", visits: 12840, deals: 86, commission: 2784000, listings: 248, change: "12,8 %", months: ["Août", "Août", "Sept.", "Sept.", "Oct.", "Oct."] },
  6: { label: "Mai — Octobre 2026", visits: 24960, deals: 172, commission: 5568000, listings: 248, change: "16,2 %", months: ["Mai", "Juin", "Juil.", "Août", "Sept.", "Oct."] },
  12: { label: "Novembre 2025 — Octobre 2026", visits: 48210, deals: 326, commission: 10554000, listings: 248, change: "21,5 %", months: ["Nov.", "Janv.", "Mars", "Mai", "Juil.", "Sept.", "Oct."] }
};
const transactionData = [
  { property: "Villa lumineuse avec jardin", area: "Haie Vive, Cotonou", image: "photo-1600596542815-ffad4c1539a9", tenant: "Aïcha K.", owner: "M. Hounkpatin", rent: 350000, date: "16 oct. 2026" },
  { property: "Studio étudiant tout équipé", area: "Ouando, Porto-Novo", image: "photo-1522708323590-d24dbb6b0267", tenant: "Yves A.", owner: "Mme Soglo", rent: 55000, date: "15 oct. 2026" },
  { property: "Appartement avec terrasse", area: "Centre-ville, Parakou", image: "photo-1600210492486-724fe5c67fb0", tenant: "Mariam D.", owner: "M. Bio Tchané", rent: 120000, date: "14 oct. 2026" },
  { property: "Appartement cosy au calme", area: "Arconville, Abomey-Calavi", image: "photo-1600607687939-ce8a6c25118c", tenant: "Gildas A.", owner: "Mme Adjahoui", rent: 95000, date: "12 oct. 2026" },
  { property: "Maison familiale contemporaine", area: "Fidjrossè, Cotonou", image: "photo-1600047509807-ba8f99d2cdde", tenant: "Sarah O.", owner: "M. Kora", rent: 280000, date: "10 oct. 2026" },
  { property: "Petit nid près des commodités", area: "Akpakpa, Cotonou", image: "photo-1493809842364-78817add7ffb", tenant: "Paul A.", owner: "Mme Adjovi", rent: 75000, date: "8 oct. 2026" },
  { property: "Studio moderne proche campus", area: "Université, Abomey-Calavi", image: "photo-1502672260266-1c1ef2d93688", tenant: "Noël S.", owner: "M. Dossou", rent: 60000, date: "6 oct. 2026" },
  { property: "Bel appartement en résidence", area: "Cadjèhoun, Cotonou", image: "photo-1600566753190-17f0baa2a6c3", tenant: "Estelle M.", owner: "Mme Zinsou", rent: 230000, date: "4 oct. 2026" }
];
const formatMoney = value => new Intl.NumberFormat("fr-FR").format(value);
const imageUrl = image => `https://images.unsplash.com/${image}?auto=format&fit=crop&w=120&q=70`;
let selectedPeriod = 3;

function renderSparkline(elementId, seed) {
  document.getElementById(elementId).innerHTML = Array.from({ length: 11 }, (_, index) => {
    const height = 22 + ((index * 19 + seed * 17 + index * index * 7) % 70);
    return `<i style="--bar-height:${height}%"></i>`;
  }).join("");
}

function renderTransactions() {
  document.getElementById("transaction-body").innerHTML = transactionData.map(item => {
    const commission = Math.round(item.rent * 3 * 0.1);
    return `<tr><td><div class="table-property"><img class="table-thumb" src="${imageUrl(item.image)}" alt=""><span><strong>${item.property}</strong><span class="table-sub">${item.area}</span></span></div></td><td><strong>${item.tenant}</strong><span class="table-sub">Locataire</span></td><td><strong>${item.owner}</strong><span class="table-sub">${item.date}</span></td><td><strong>${formatMoney(item.rent)} FCFA</strong><span class="table-sub">/ mois</span></td><td class="commission-cell">${formatMoney(commission)} FCFA</td><td><span class="status-pill"><i></i> Conclue</span></td></tr>`;
  }).join("");
}

function renderChart(data, kind) {
  const value = kind === "visits" ? data.visits : data.deals;
  const totalLabel = kind === "visits" ? "visites sur la période" : "locations sur la période";
  document.getElementById("chart-total").textContent = formatMoney(value);
  document.getElementById("chart-total-label").textContent = totalLabel;
  document.querySelector(".chart-change").textContent = `↗ ${data.change}`;
  const fractions = [0.48, 0.65, 0.52, 0.75, 0.64, 0.92, 0.79, 0.86, 0.7, 0.96, 0.82, 1];
  const values = data.months.map((_, index) => fractions[(index + selectedPeriod) % fractions.length] * (0.75 + ((index * 13) % 22) / 100));
  document.getElementById("chart-y-axis").innerHTML = ["100 %", "75 %", "50 %", "25 %"].map(label => `<span>${label}</span>`).join("");
  document.getElementById("chart-plot").innerHTML = data.months.map((month, index) => {
    const first = Math.round(Math.min(.97, values[index]) * 88 + 7);
    const second = Math.round(Math.min(.55, values[index] * .48) * 80 + 4);
    return `<div class="chart-column"><div class="chart-column-inner"><i style="--bar-height:${kind === "visits" ? first : second}%"></i><i style="--bar-height:${kind === "visits" ? second : first}%"></i></div><small>${month}</small></div>`;
  }).join("");
}

function updateDashboard(period) {
  selectedPeriod = period;
  const data = reportData[period];
  document.querySelectorAll(".period-button").forEach(button => button.classList.toggle("selected", Number(button.dataset.period) === period));
  document.getElementById("period-date").textContent = data.label;
  document.getElementById("visits-value").textContent = formatMoney(data.visits);
  document.getElementById("deals-value").textContent = formatMoney(data.deals);
  document.getElementById("commission-value").innerHTML = `${formatMoney(data.commission)} <small>FCFA</small>`;
  document.getElementById("listings-value").textContent = formatMoney(data.listings);
  document.getElementById("commission-panel-total").innerHTML = `${formatMoney(data.commission)} <small>FCFA</small>`;
  document.getElementById("commission-deals").textContent = formatMoney(data.deals);
  document.getElementById("commission-average").textContent = `${formatMoney(Math.round(data.commission / data.deals))} FCFA`;
  document.getElementById("transaction-count").textContent = `${Math.min(data.deals, transactionData.length)} transactions récentes sur ${formatMoney(data.deals)}`;
  ["visits-spark", "deals-spark", "commission-spark", "listings-spark"].forEach((id, index) => renderSparkline(id, index + period));
  renderChart(data, document.getElementById("chart-period").value);
}

document.querySelectorAll(".period-button").forEach(button => button.addEventListener("click", () => updateDashboard(Number(button.dataset.period))));
document.getElementById("chart-period").addEventListener("change", event => renderChart(reportData[selectedPeriod], event.target.value));
document.getElementById("transaction-filter").addEventListener("click", () => {
  const button = document.getElementById("transaction-filter");
  button.textContent = button.textContent.startsWith("Toutes") ? "Conclues ✓" : "Toutes les locations ⌄";
});
document.getElementById("export-report").addEventListener("click", () => {
  const data = reportData[selectedPeriod];
  const rows = [["Période", "Visites", "Locations conclues", "Commissions FCFA", "Commission"], [data.label, data.visits, data.deals, data.commission, "10% du loyer x 3 mois minimum"]];
  const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(";")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
  link.download = `noyau-rapport-${selectedPeriod}-mois.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
});

renderTransactions();
updateDashboard(selectedPeriod);
