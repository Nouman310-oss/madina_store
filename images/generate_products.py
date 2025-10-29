import os, json

base_dir = "images"  # Folder containing all category subfolders
output_file = "products.json"

products = {}

# Walk through each subfolder inside 'images'
for category in os.listdir(base_dir):
    category_path = os.path.join(base_dir, category)
    if os.path.isdir(category_path):
        products[category] = []
        for filename in os.listdir(category_path):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp','jfif')):
                product_name = os.path.splitext(filename)[0].replace('_', ' ').title()
                price = round(5 + hash(filename) % 25, 2)  # Random price for example
                image_path = f"{base_dir}/{category}/{filename}"
                products[category].append({
                    "name": product_name,
                    "price": price,
                    "image": image_path
                })

# Save to products.json
with open(output_file, "w") as f:
    json.dump(products, f, indent=2)

print(f"✅ products.json generated successfully with {len(products)} categories!")
