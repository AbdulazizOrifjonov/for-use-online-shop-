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
    
    # 1. Remove min-w-[...] from <table>
    content = re.sub(r'<table className="([^"]*)min-w-\[[^\]]+\]([^"]*)"', r'<table className="\1\2"', content)
    content = re.sub(r' +', ' ', content) # fix multiple spaces
    content = re.sub(r' className=" "', r' className=""', content)
    
    # Ensure w-full and text-sm
    if '<table className="w-full text-sm">' not in content:
        content = re.sub(r'<table className="([^"]*)"', lambda m: f'<table className="w-full text-sm {m.group(1).replace("w-full", "").replace("text-sm", "").strip()}">', content)
        content = re.sub(r' +">', '">', content)
        
    # 2. Change p-3 or p-4 to px-2 py-3 sm:p-3 on <th> and <td>
    # Wait, some might have other classes.
    def replace_padding(m):
        cls = m.group(1)
        cls = re.sub(r'\bp-3\b', 'px-2 py-3 sm:p-3', cls)
        cls = re.sub(r'\bp-4\b', 'px-2 py-3 sm:p-3', cls)
        return f'className="{cls}"'

    content = re.sub(r'className="([^"]*(?:p-3|p-4)[^"]*)"', replace_padding, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
print("Done fixing basic table classes.")
