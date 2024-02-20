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
                    'key': process.env.RAJAONGKIR_API,
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