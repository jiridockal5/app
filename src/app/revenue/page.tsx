// app/revenue/page.tsx

"use client";



import { useState } from "react";

import {

  LineChart,

  Line,

  XAxis,

  YAxis,

  Tooltip,

  CartesianGrid,

  ResponsiveContainer,

  Legend,

} from "recharts";



export default function RevenueForecastPage() {

  const [settings, setSettings] = useState({

    months: 24,

    starting_mrr: 10000,

  });



  const [plg, setPlg] = useState({

    enabled: true,

    signups: 5000,

    conversion_rate: 0.03,

    arpu: 25,

  });



  const [sales, setSales] = useState({

    enabled: true,

    pipeline_value: 150000,

    win_rate: 0.2,

    sales_cycle_months: 2,

    acv: 4800, // kept for future use

  });



  const [partners, setPartners] = useState({

    enabled: true,

    partners_active: 10,

    new_partners_per_month: 2,

    avg_customers_per_partner: 4,

    arpu: 40,

    commission_rate: 0.2,

  });



  const forecastRevenue = () => {

    const months = settings.months;

    let mrr = settings.starting_mrr;

    const result: Array<{

      month: number;

      newMRR: number;

      endingMRR: number;

      ARR: number;

    }> = [];



    for (let month = 1; month <= months; month++) {

      let newMRR = 0;



      // PLG: only additive new MRR

      if (plg.enabled) {

        const newUsers = plg.signups * plg.conversion_rate;

        newMRR += newUsers * plg.arpu;

      }



      // Sales: convert expected closed value to MRR

      if (sales.enabled) {

        const closedValue =

          (sales.pipeline_value * sales.win_rate) / Math.max(1, sales.sales_cycle_months);

        newMRR += closedValue / 12; // ACV->MRR equivalent

      }



      // Partners: additive MRR with partner base growing monthly

      if (partners.enabled) {

        const effectivePartners =

          partners.partners_active + (month - 1) * partners.new_partners_per_month;

        const partnerMRR =

          effectivePartners *

          partners.avg_customers_per_partner *

          partners.arpu *

          (1 - partners.commission_rate);

        newMRR += partnerMRR;

      }



      const netNewMRR = newMRR; // no churn/expansion here

      mrr += netNewMRR;



      result.push({

        month,

        newMRR: Math.round(newMRR),

        endingMRR: Math.round(mrr),

        ARR: Math.round(mrr * 12),

      });

    }



    return result;

  };



  const data = forecastRevenue();



  return (

    <div className="p-6 space-y-8">

      <h1 className="text-3xl font-bold">💰 SaaS Revenue Forecast (Additive Only)</h1>



      {/* Global settings quick controls */}

      <div className="flex items-center gap-6">

        <div className="flex items-center gap-2">

          <label className="font-medium">Months</label>

          <input

            type="number"

            min={1}

            value={settings.months}

            onChange={(e) =>

              setSettings({ ...settings, months: parseInt(e.target.value || "1") })

            }

            className="w-24 border rounded px-2 py-1"

          />

        </div>

        <div className="flex items-center gap-2">

          <label className="font-medium">Starting MRR</label>

          <input

            type="number"

            step="any"

            value={settings.starting_mrr}

            onChange={(e) =>

              setSettings({ ...settings, starting_mrr: parseFloat(e.target.value) })

            }

            className="w-32 border rounded px-2 py-1"

          />

        </div>

      </div>



      {/* Toggles */}

      <div className="flex gap-6">

        {[

          ["PLG", plg, setPlg],

          ["Sales", sales, setSales],

          ["Partners", partners, setPartners],

        ].map(([label, state, setState]: any) => (

          <label key={label} className="flex items-center gap-2">

            <input

              type="checkbox"

              checked={state.enabled}

              onChange={(e) => setState({ ...state, enabled: e.target.checked })}

            />

            {label}

          </label>

        ))}

      </div>



      {/* Inputs */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* PLG */}

        {plg.enabled && (

          <div className="p-4 border rounded-2xl shadow">

            <h2 className="font-semibold mb-2">PLG Inputs</h2>

            <div className="flex justify-between mb-2">
              <label>Monthly Signups</label>
              <input
                type="number"
                step="any"
                value={plg.signups}
                onChange={(e) =>
                  setPlg({ ...plg, signups: parseFloat(e.target.value) })
                }
                className="w-28 border rounded px-2"
              />
            </div>
            <div className="flex justify-between mb-2">
              <label>Conversion Rate (%)</label>
              <input
                type="number"
                step="any"
                value={plg.conversion_rate * 100}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    setPlg({ ...plg, conversion_rate: value / 100 });
                  }
                }}
                className="w-28 border rounded px-2"
              />
            </div>
            <div className="flex justify-between mb-2">
              <label>ARPU (Monthly)</label>
              <input
                type="number"
                step="any"
                value={plg.arpu}
                onChange={(e) =>
                  setPlg({ ...plg, arpu: parseFloat(e.target.value) })
                }
                className="w-28 border rounded px-2"
              />
            </div>

          </div>

        )}



        {/* Sales */}

        {sales.enabled && (

          <div className="p-4 border rounded-2xl shadow">

            <h2 className="font-semibold mb-2">Sales Inputs</h2>

            <div className="flex justify-between mb-2">
              <label>Pipeline Value</label>
              <input
                type="number"
                step="any"
                value={sales.pipeline_value}
                onChange={(e) =>
                  setSales({ ...sales, pipeline_value: parseFloat(e.target.value) })
                }
                className="w-28 border rounded px-2"
              />
            </div>
            <div className="flex justify-between mb-2">
              <label>Win Rate (%)</label>
              <input
                type="number"
                step="any"
                value={sales.win_rate * 100}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    setSales({ ...sales, win_rate: value / 100 });
                  }
                }}
                className="w-28 border rounded px-2"
              />
            </div>
            <div className="flex justify-between mb-2">
              <label>Sales Cycle (Months)</label>
              <input
                type="number"
                step="any"
                value={sales.sales_cycle_months}
                onChange={(e) =>
                  setSales({ ...sales, sales_cycle_months: parseFloat(e.target.value) })
                }
                className="w-28 border rounded px-2"
              />
            </div>
            <div className="flex justify-between mb-2">
              <label>ACV (Annual Contract Value)</label>
              <input
                type="number"
                step="any"
                value={sales.acv}
                onChange={(e) =>
                  setSales({ ...sales, acv: parseFloat(e.target.value) })
                }
                className="w-28 border rounded px-2"
              />
            </div>

          </div>

        )}



        {/* Partners */}

        {partners.enabled && (

          <div className="p-4 border rounded-2xl shadow">

            <h2 className="font-semibold mb-2">Partner Inputs</h2>

            <div className="flex justify-between mb-2">
              <label>Active Partners (Starting)</label>
              <input
                type="number"
                step="any"
                value={partners.partners_active}
                onChange={(e) =>
                  setPartners({ ...partners, partners_active: parseFloat(e.target.value) })
                }
                className="w-28 border rounded px-2"
              />
            </div>
            <div className="flex justify-between mb-2">
              <label>New Partners per Month</label>
              <input
                type="number"
                step="any"
                value={partners.new_partners_per_month}
                onChange={(e) =>
                  setPartners({ ...partners, new_partners_per_month: parseFloat(e.target.value) })
                }
                className="w-28 border rounded px-2"
              />
            </div>
            <div className="flex justify-between mb-2">
              <label>Avg Customers per Partner</label>
              <input
                type="number"
                step="any"
                value={partners.avg_customers_per_partner}
                onChange={(e) =>
                  setPartners({ ...partners, avg_customers_per_partner: parseFloat(e.target.value) })
                }
                className="w-28 border rounded px-2"
              />
            </div>
            <div className="flex justify-between mb-2">
              <label>ARPU (Monthly)</label>
              <input
                type="number"
                step="any"
                value={partners.arpu}
                onChange={(e) =>
                  setPartners({ ...partners, arpu: parseFloat(e.target.value) })
                }
                className="w-28 border rounded px-2"
              />
            </div>
            <div className="flex justify-between mb-2">
              <label>Commission Rate (%)</label>
              <input
                type="number"
                step="any"
                value={partners.commission_rate * 100}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    setPartners({ ...partners, commission_rate: value / 100 });
                  }
                }}
                className="w-28 border rounded px-2"
              />
            </div>

          </div>

        )}

      </div>



      {/* Chart */}

      <div className="w-full h-96">

        <ResponsiveContainer>

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line type="monotone" dataKey="endingMRR" name="MRR" />

            <Line type="monotone" dataKey="ARR" name="ARR" />

          </LineChart>

        </ResponsiveContainer>

      </div>



      {/* Table */}

      <div className="overflow-auto">

        <table className="min-w-full text-sm border">

          <thead className="bg-gray-100">

            <tr>

              {["Month", "New MRR", "Ending MRR", "ARR"].map((h) => (

                <th key={h} className="px-2 py-1 border">

                  {h}

                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {data.map((row) => (

              <tr key={row.month}>

                <td className="px-2 py-1 border text-right">{row.month}</td>

                <td className="px-2 py-1 border text-right">

                  {row.newMRR.toLocaleString()}

                </td>

                <td className="px-2 py-1 border text-right">

                  {row.endingMRR.toLocaleString()}

                </td>

                <td className="px-2 py-1 border text-right">

                  {row.ARR.toLocaleString()}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}
