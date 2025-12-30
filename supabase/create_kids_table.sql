-- Create the table for Kids Bikes
CREATE TABLE IF NOT EXISTS bikes_kids (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Kids',
    material TEXT DEFAULT 'Acero al carbono de alta resistencia / Caucho / Esponja',
    image_url TEXT, -- Main image
    sizes JSONB NOT NULL, -- Array of objects: { size, price, code, weight, age }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Data
-- 750 Kid Bicycle (12")
INSERT INTO bikes_kids (name, description, image_url, sizes) VALUES
('750 Kid Bicycle', 'Bicicleta para niños modelo 750, diseño deportivo.', 'PROO-101.png', '[{"size": "12\"", "price": 4995, "code": "PROO-101", "weight": "8.5 kg / 9.5 kg", "age": "5-10 años"}]'),
('750 Kid Bicycle', 'Bicicleta para niños modelo 750, color verde.', 'PROO-102.png', '[{"size": "12\"", "price": 4995, "code": "PROO-102", "weight": "8.5 kg / 9.5 kg", "age": "5-10 años"}]'),
('750 Kid Bicycle', 'Bicicleta para niños modelo 750, color rojo.', 'PROO-103.png', '[{"size": "12\"", "price": 4995, "code": "PROO-103", "weight": "8.5 kg / 9.5 kg", "age": "5-10 años"}]');

-- YF-3 Kid Bicycle (12", 16", 20")
INSERT INTO bikes_kids (name, description, image_url, sizes) VALUES
('YF-3 Kid Bicycle', 'Bicicleta modelo YF-3, colores vibrantes.', 'PROO-105.png', '[
    {"size": "12\"", "price": 4750, "code": "PROO-105", "weight": "8.5 kg / 9.5 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-108", "weight": "10 kg / 11 kg", "age": "5-10 años"},
    {"size": "20\"", "price": 6500, "code": "PROO-112", "weight": "11.5 kg / 12.5 kg", "age": "5-10 años"}
]'),
('YF-3 Kid Bicycle', 'Bicicleta modelo YF-3, edición rojo y negro.', 'PROO-106.png', '[
    {"size": "12\"", "price": 4750, "code": "PROO-106", "weight": "8.5 kg / 9.5 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-109", "weight": "10 kg / 11 kg", "age": "5-10 años"},
    {"size": "20\"", "price": 6500, "code": "PROO-111", "weight": "11.5 kg / 12.5 kg", "age": "5-10 años"}
]'),
('YF-3 Kid Bicycle', 'Bicicleta modelo YF-3, edición rojo y azul.', 'PROO-104.png', '[
    {"size": "12\"", "price": 4750, "code": "PROO-104", "weight": "8.5 kg / 9.5 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-107", "weight": "10 kg / 11 kg", "age": "5-10 años"},
    {"size": "20\"", "price": 6500, "code": "PROO-110", "weight": "11.5 kg / 12.5 kg", "age": "5-10 años"}
]');

-- QIAONVHAI Kid Bicycle (12", 16")
INSERT INTO bikes_kids (name, description, image_url, sizes) VALUES
('QIAONVHAI Kid Bicycle', 'Bicicleta QIAONVHAI estilo princesa, rosa.', 'PROO-113.png', '[
    {"size": "12\"", "price": 4900, "code": "PROO-113", "weight": "7.4 kg / 8 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5995, "code": "PROO-116", "weight": "8.8 kg / 9.4 kg", "age": "5-10 años"}
]'),
('QIAONVHAI Kid Bicycle', 'Bicicleta QIAONVHAI estilo princesa, lila.', 'PROO-114.png', '[
    {"size": "12\"", "price": 4900, "code": "PROO-114", "weight": "7.4 kg / 8 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5995, "code": "PROO-117", "weight": "8.8 kg / 9.4 kg", "age": "5-10 años"}
]'),
('QIAONVHAI Kid Bicycle', 'Bicicleta QIAONVHAI estilo princesa, morado.', 'PROO-115.png', '[
    {"size": "12\"", "price": 4900, "code": "PROO-115", "weight": "7.4 kg / 8 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5995, "code": "PROO-118", "weight": "8.8 kg / 9.4 kg", "age": "5-10 años"}
]');

-- YF-602 Kid Bicycle (12", 16") - First Batch
INSERT INTO bikes_kids (name, description, image_url, sizes) VALUES
('YF-602 Kid Bicycle', 'Bicicleta YF-602, rosa intenso.', 'PROO-119.png', '[
    {"size": "12\"", "price": 4900, "code": "PROO-119", "weight": "15.2 kg / 16.2 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5995, "code": "PROO-122", "weight": "17.5 kg / 18.5 kg", "age": "5-10 años"}
]'),
('YF-602 Kid Bicycle', 'Bicicleta YF-602, lila.', 'PROO-120.png', '[
    {"size": "12\"", "price": 4900, "code": "PROO-120", "weight": "15.2 kg / 16.2 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5995, "code": "PROO-123", "weight": "17.5 kg / 18.5 kg", "age": "5-10 años"}
]'),
('YF-602 Kid Bicycle', 'Bicicleta YF-602, rosa claro.', 'PROO-121.png', '[
    {"size": "12\"", "price": 4900, "code": "PROO-121", "weight": "15.2 kg / 16.2 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5995, "code": "PROO-124", "weight": "17.5 kg / 18.5 kg", "age": "5-10 años"}
]');

-- DC039 Kid Bicycle (20", 22")
INSERT INTO bikes_kids (name, description, image_url, sizes) VALUES
('DC039 Kid Bicycle', 'Bicicleta DC039, diseño robusto rosa.', 'PROO-125.png', '[
    {"size": "20\"", "price": 6900, "code": "PROO-125", "weight": "14 kg / 15 kg", "age": "5-10 años"},
    {"size": "22\"", "price": 6900, "code": "PROO-126", "weight": "15 kg / 16 kg", "age": "5-10 años"}
]');

-- YF-1 Kid Bicycle (12", 16")
INSERT INTO bikes_kids (name, description, image_url, sizes) VALUES
('YF-1 Kid Bicycle', 'Bicicleta YF-1, verde y naranja.', 'PROO-127.png', '[
    {"size": "12\"", "price": 4900, "code": "PROO-127", "weight": "14.6 kg / 15.6 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-130", "weight": "17 kg / 18 kg", "age": "5-10 años"}
]'),
('YF-1 Kid Bicycle', 'Bicicleta YF-1, morado.', 'PROO-128.png', '[
    {"size": "12\"", "price": 4900, "code": "PROO-128", "weight": "14.6 kg / 15.6 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-131", "weight": "17 kg / 18 kg", "age": "5-10 años"}
]'),
('YF-1 Kid Bicycle', 'Bicicleta YF-1, variante rosa.', 'PROO-129.png', '[
    {"size": "12\"", "price": 4900, "code": "PROO-129", "weight": "14.6 kg / 15.6 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-132", "weight": "17 kg / 18 kg", "age": "5-10 años"}
]');

-- YF-602 Kid Bicycle (12", 16", 20") - Second Batch
INSERT INTO bikes_kids (name, description, image_url, sizes) VALUES
('YF-602 Kid Bicycle', 'Bicicleta YF-602, variante rosa/blanco.', 'PROO-135.png', '[
    {"size": "12\"", "price": 4750, "code": "PROO-135", "weight": "14.7 kg / 15.8 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-138", "weight": "17.1 kg / 18.4 kg", "age": "5-10 años"},
    {"size": "20\"", "price": 6500, "code": "PROO-135-20", "weight": "N/A", "age": "5-10 años"}
]'),
('YF-602 Kid Bicycle', 'Bicicleta YF-602, variante lila/blanco.', 'PROO-134.png', '[
    {"size": "12\"", "price": 4750, "code": "PROO-134", "weight": "14.7 kg / 15.8 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-137", "weight": "17.1 kg / 18.4 kg", "age": "5-10 años"},
    {"size": "20\"", "price": 6500, "code": "PROO-134-20", "weight": "N/A", "age": "5-10 años"}
]'),
('YF-602 Kid Bicycle', 'Bicicleta YF-602, variante fuchsia.', 'PROO-133.png', '[
    {"size": "12\"", "price": 4750, "code": "PROO-133", "weight": "14.7 kg / 15.8 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-136", "weight": "17.1 kg / 18.4 kg", "age": "5-10 años"},
    {"size": "20\"", "price": 6500, "code": "PROO-133-20", "weight": "N/A", "age": "5-10 años"}
]');

-- A99 Kid Bicycle (12", 16")
INSERT INTO bikes_kids (name, description, image_url, sizes) VALUES
('A99 Kid Bicycle', 'Bicicleta A99, cian y rosa.', 'PROO-140.png', '[
    {"size": "12\"", "price": 4750, "code": "PROO-140", "weight": "15.2 kg / 16.3 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-143", "weight": "17.5 kg / 18.8 kg", "age": "5-10 años"}
]'),
('A99 Kid Bicycle', 'Bicicleta A99, morado y amarillo.', 'PROO-141.png', '[
    {"size": "12\"", "price": 4750, "code": "PROO-141", "weight": "15.2 kg / 16.3 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-144", "weight": "17.5 kg / 18.8 kg", "age": "5-10 años"}
]'),
('A99 Kid Bicycle', 'Bicicleta A99, naranja y verde.', 'PROO-139.png', '[
    {"size": "12\"", "price": 4750, "code": "PROO-139", "weight": "15.2 kg / 16.3 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-142", "weight": "17.5 kg / 18.8 kg", "age": "5-10 años"}
]');

-- Q6 Kid Bicycle (12", 16")
INSERT INTO bikes_kids (name, description, image_url, sizes) VALUES
('Q6 Kid Bicycle', 'Bicicleta Q6, rosa.', 'PROO-145.png', '[
    {"size": "12\"", "price": 4750, "code": "PROO-145", "weight": "12.8 kg / 13.9 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-148", "weight": "14.9 kg / 16.2 kg", "age": "5-10 años"}
]'),
('Q6 Kid Bicycle', 'Bicicleta Q6, azul y rojo.', 'PROO-146.png', '[
    {"size": "12\"", "price": 4750, "code": "PROO-146", "weight": "12.8 kg / 13.9 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-149", "weight": "14.9 kg / 16.2 kg", "age": "5-10 años"}
]'),
('Q6 Kid Bicycle', 'Bicicleta Q6, morado.', 'PROO-147.png', '[
    {"size": "12\"", "price": 4750, "code": "PROO-147", "weight": "12.8 kg / 13.9 kg", "age": "5-10 años"},
    {"size": "16\"", "price": 5950, "code": "PROO-150", "weight": "14.9 kg / 16.2 kg", "age": "5-10 años"}
]');

-- FN24 Speed Kid Bicycle
INSERT INTO bikes_kids (name, description, image_url, sizes) VALUES
('FN24-1 Speed Kid Bicycle', 'Bicicleta de velocidad FN24-1, morado.', 'PROO-151.png', '[
    {"size": "20\"", "price": 6900, "code": "PROO-151", "weight": "N/A", "age": "5-10 años"}
]'),
('FN24-1 Speed Kid Bicycle', 'Bicicleta de velocidad FN24-1, blanco.', 'PROO-152.png', '[
    {"size": "20\"", "price": 6900, "code": "PROO-152", "weight": "N/A", "age": "5-10 años"}
]'),
('FN24-6 Speed Kid Bicycle', 'Bicicleta de velocidad FN24-6, blanco y azul.', 'PROO-153.png', '[
    {"size": "22\"", "price": 7495, "code": "PROO-153", "weight": "N/A", "age": "5-10 años"}
]'),
('FN24-6 Speed Kid Bicycle', 'Bicicleta de velocidad FN24-6, blanco y negro.', 'PROO-154.png', '[
    {"size": "22\"", "price": 7495, "code": "PROO-154", "weight": "N/A", "age": "5-10 años"}
]');
