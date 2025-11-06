import { Product } from "@/types/products";
import * as XLSX from "xlsx";

export const processExcelFile = (file: File): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData =
          XLSX.utils.sheet_to_json<Record<string, never>>(worksheet);

        const processedData: Product[] = jsonData.map((row) => ({
          id: row.id || row.ID,
          product_no: row.product_no || row.PRODUCT_NO || "",
          category_id: row.category_id || row.CATEGORY_ID || "",
          category: row.category || row.CATEGORY || "",
          brand_id: row.brand_id || row.BRAND_ID || "",
          brand: row.brand || row.BRAND || "",
          name: row.name || row.NAME || "",
          warranty_id: row.warranty_id || row.WARRANTY_ID || "",
          warranty: row.warranty || row.WARRANTY || "",
          dp_price: parseFloat(row.dp_price || row.DP_PRICE || "0"),
          rp_price: parseFloat(row.rp_price || row.RP_PRICE || "0"),
          map_price: parseFloat(row.map_price || row.MAP_PRICE || "0"),
          mrp_price: parseFloat(row.mrp_price || row.MRP_PRICE || "0"),
          url: row.url || row.URL || "",
        }));

        resolve(processedData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

export const processGoogleSheetCsv = async (
  csvUrl: string
): Promise<Product[]> => {
  const response = await fetch(csvUrl);
  const text = await response.text();

  const rows = text.split("\n").map((row) => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      if (row[i] === '"') {
        inQuotes = !inQuotes;
      } else if (row[i] === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += row[i];
      }
    }
    values.push(current.trim());
    return values;
  });

  const headers = rows[0].map((h) => h.toLowerCase().replace(/"/g, "").trim());
  const data: Product[] = rows
    .slice(1)
    .filter((row) => row.some((cell) => cell))
    .map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, i) => {
        obj[header] = row[i]?.replace(/"/g, "") || "";
      });
      return {
        id: obj.id,
        product_no: obj.product_no || "",
        category_id: obj.category_id || "",
        category: obj.category || "",
        brand_id: obj.brand_id || "",
        brand: obj.brand || "",
        name: obj.name || "",
        warranty_id: obj.warranty_id || "",
        warranty: obj.warranty || "",
        dp_price: parseFloat(obj.dp_price || "0"),
        rp_price: parseFloat(obj.rp_price || "0"),
        map_price: parseFloat(obj.map_price || "0"),
        mrp_price: parseFloat(obj.mrp_price || "0"),
        url: obj.url || "",
      };
    });

  return data;
};
