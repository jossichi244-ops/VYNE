driver_candidates = []

# Ưu tiên các cột có tên gợi ý "số lượng", "khối lượng", "quantity"
quantity_keywords = ["qty", "quantity", "amount", "volume", "weight", "count"]
for col in numeric_features:
    if any(kw in col.lower() for kw in quantity_keywords):
        driver_candidates.append(col)

# Nếu không có, mới dùng heuristic thống kê
if not driver_candidates:
    for col in numeric_features:
        series = df[col].dropna()
        if len(series) < 10:
            continue
        if series.skew() > 0.5 and series.var() > 0: 
            driver_candidates.append(col)