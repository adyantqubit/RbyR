# import webcolors


# def get_color_name(hex_code):
#     try:
#         # Get the exact color name if available
#         return webcolors.hex_to_name(hex_code)
#     except ValueError:
#         # If no exact name is available, find the closest color name
#         closest_name = get_closest_color_name(hex_code)
#         return closest_name


# def get_closest_color_name(hex_code):
#     # Convert hex to RGB first
#     rgb_tuple = webcolors.hex_to_rgb(hex_code)

#     # Compare it to all CSS3 color names and find the closest one
#     min_colors = {}
#     for key, name in webcolors.css3_names_to_hex.items():
#         r_c, g_c, b_c = webcolors.hex_to_rgb(key)
#         rd = (r_c - rgb_tuple.red) ** 2
#         gd = (g_c - rgb_tuple.green) ** 2
#         bd = (b_c - rgb_tuple.blue) ** 2
#         min_colors[(rd + gd + bd)] = name

#     # Return the closest color name
#     return min_colors[min(min_colors.keys())]
