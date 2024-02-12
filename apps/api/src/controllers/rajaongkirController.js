import axios from "axios";

export const getDeliveryCost = async (req, res) => {
    try {
        const { origin, destination, weight, courier } = req.body;
        const response = await axios.post(
            'https://api.rajaongkir.com/starter/cost',
            {
                origin,
                destination,
                weight,
                courier,
            },
            {
                headers: {
                    'key': '1c0a173111985e49ddd6d798c4c7ec9f',
                    'content-type': 'application/x-www-form-urlencoded',
                },
            }
        )
        res.json(response.data);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}