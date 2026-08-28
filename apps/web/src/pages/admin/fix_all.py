import os
import re

directory = r"c:\Users\Abdul\OneDrive\Desktop\SORA CAKE BAKERY\apps\web\src\pages\admin"
files = ["AdminUsers.jsx", "Brands.jsx", "Coupons.jsx", "Orders.jsx", "Products.jsx", "Users.jsx"]

for filename in files:
    filepath = os.path.join(directory, filename)
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix the double replacement: px-2 py-3 sm:px-2 py-3 sm:p-3
    content = content.replace('px-2 py-3 sm:px-2 py-3 sm:p-3', 'px-2 py-3 sm:p-3')
    
    # In general, if there are multiple px-2 py-3 sm:p-3, let's just make them unique
    while 'px-2 py-3 sm:px-2 py-3 sm:p-3' in content:
        content = content.replace('px-2 py-3 sm:px-2 py-3 sm:p-3', 'px-2 py-3 sm:p-3')

    # For Products.jsx specifically
    if filename == "Products.jsx":
        # The user asked: ensure the total width of the 3 visible action buttons fits on narrow screens
        content = content.replace('flex justify-end gap-0.5 sm:gap-1', 'flex justify-end gap-1')
        content = content.replace('h-7 w-7 sm:h-8 sm:w-8', 'h-6 w-6 sm:h-8 sm:w-8')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done fixing double replacement")
