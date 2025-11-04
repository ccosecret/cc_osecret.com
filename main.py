import tinkter as tk  
def on_button_click():
    label.config(text="Button Clicked!")    

root = tk.Tk()
root.title("Simple Tkinter App")

label = tk.Label(root, text="Hello, Tkinter!")
label.pack(pady=10)

button = tk.Button(root, text="Click Me", command=on_button_click)
button.pack(pady=10)

root.mainloop()
