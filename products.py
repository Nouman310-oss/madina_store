import os
import json
import subprocess

BASE_DIR = "images"
OUTPUT_FILE = "products.json"

def load_existing_products():
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r") as f:
            return json.load(f)
    return {}

def generate_products_json():
    existing_products = load_existing_products()
    products = {}

    for category in os.listdir(BASE_DIR):
        category_path = os.path.join(BASE_DIR, category)
        if not os.path.isdir(category_path):
            continue

        items = []
        for img_file in os.listdir(category_path):
            if img_file.lower().endswith((".jpg", ".jpeg", ".png", ".gif", ".webp","jfif")):
                name = os.path.splitext(img_file)[0].replace("_", " ").title()
                img_path = f"images/{category}/{img_file}"

                # Check if product already exists
                existing_item = next(
                    (i for i in existing_products.get(category.capitalize(), [])
                     if i["img"] == img_path), None
                )

                if existing_item:
                    price = existing_item["price"]
                    print(f"✅ {name} already exists — keeping price Rs.{price}")
                else:
                    price_input = input(f"💰 Enter price for {name} ({category}): Rs. ")
                    try:
                        price = int(price_input)
                    except ValueError:
                        price = 100

                items.append({"name": name, "price": int(price), "img": img_path})

        products[category.capitalize()] = items

    with open(OUTPUT_FILE, "w") as f:
        json.dump(products, f, indent=2)
    print(f"\n✅ {OUTPUT_FILE} updated successfully!")

def git_push_changes():
    print("\n🚀 Committing and pushing changes to GitHub...")
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "-m", "Auto-update products.json"])
    subprocess.run(["git", "push"])
    print("✅ Pushed to GitHub successfully!")

if __name__ == "__main__":
    generate_products_json()
    git_push_changes()
