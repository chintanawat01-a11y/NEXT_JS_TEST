const service = require('./service');
const message_status = require('../../config/message_status');
const { Product, ID_ToName, Name } = require('./model');

exports.viwe_all = async (req, res) => {
    try {
        const results = await service.viwe_all();
        switch (results.status) {
            case 200:
                const payload = results.results.map((results) => 
                    new Product (
                        results.product_id,
                        results.product_category,
                        results.product_name,
                        results.product_detail,
                        results.product_price,
                        results.product_stock,
                        results.product_url_img,
                        results.product_created_at,
                        results.store_id,
                        results.store_name,
                        results.store_owner,
                        results.user_username,
                        new Name(results.user_fname, results.user_lname),
                        results.user_phone_num,
                        results.user_email
                    )
                );

                return res.code(results.status).send({
                    status: results.status,
                    error: message_status["code_"+ results.status],
                    results: payload
                });

            default:
                return res.code(results.status).send({
                    status: results.status,
                    error: message_status["code_"+ results.status],
                    results: null
                });
        }

    }catch (error) {
        console.error("An error occurred during controller 'viwe_all' : ", error);
        return res.code(500).send({
            status: 500,
            error: message_status["code_"+ results.status],
            results: null
        });

    }
}

exports.viwe_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const results = await service.viwe_by_id(id);
        switch (results.status) {
            case 200:
                const payload = results.results.map((results) => 
                    new Product (
                        results.product_id,
                        results.product_category,
                        results.product_name,
                        results.product_detail,
                        results.product_price,
                        results.product_stock,
                        results.product_url_img,
                        results.product_created_at,
                        results.store_id,
                        results.store_name,
                        results.store_owner,
                        results.user_username,
                        new Name(results.user_fname, results.user_lname),
                        results.user_phone_num,
                        results.user_email
                    )
                );

                return res.code(results.status).send({
                    status: results.status,
                    error: message_status["code_" + results.status],
                    results: payload
                });

            case 404:
            case 500:
                return res.code(results.status).send({
                    status: results.status,
                    error: message_status["code_" + results.status],
                    results: results.error
                });

            default:
                return res.code(results.status).send({
                    status: results.status,
                    error: message_status["code_" + results.status],
                    results: null
                });
        }
    } catch (error) {
        console.error("An error occurred during controller 'viwe_by_id' : ", error);
        return res.code(500).send({
            status: 500,
            error: error,
            results: null
        });
    }
};

exports.create = async (req, res) => {
    try {
        const payload = req.body;

        const result = await service.create(payload);
        console.log("result", result);
        switch (result.status) {
            case 201:
                return res.code(result.status).send({
                    status: result.status,
                    error: message_status["code_" + result.status],
                    results: result.results
                });

            case 500:
                return res.code(result.status).send({
                    status: result.status,
                    error: message_status["code_" + result.status],
                    results: result.error
                });

            default:
                return res.code(result.status).send({
                    status: result.status,
                    error: message_status["code_" + result.status],
                    results: null
                });
        }
    } catch (error) {
        console.error("An error occurred during controller 'create' : ", error);
        return res.code(500).send({
            status: 500,
            error: error,
            results: null
        });
    }
};


// controller.js
exports.update_by_id = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};

    if (!id) {
      return res.code(400).send({
        status: 400,
        error: message_status["code_400"],
        results: "product ID is required",
      });
    }

    // เรียก service (Option B) -> อัปเดต + select แถวล่าสุดกลับมาใน results
    const result = await service.update_by_id(id, payload);

    switch (result.status) {
      case 200:
        return res.code(200).send({
          status: 200,
          error: null,
          results: result.results, // แถวที่อัปเดตแล้ว
        });

      case 400:
        return res.code(400).send({
          status: 400,
          error: message_status["code_400"],
          results: result.error || "No fields to update",
        });

      case 404:
        return res.code(404).send({
          status: 404,
          error: message_status["code_404"],
          results: `Failed to update product with ID '${id}' : Not Found`,
        });

      case 500:
        return res.code(500).send({
          status: 500,
          error: message_status["code_500"],
          results: result.error ?? null,
        });

      default:
        return res.code(result.status || 500).send({
          status: result.status || 500,
          error: message_status["code_" + (result.status || 500)] || null,
          results: result.results ?? null,
        });
    }
  } catch (err) {
    return res.code(500).send({
      status: 500,
      error: err?.message || String(err),
      results: null,
    });
  }
};

exports.delete_by_id = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.code(400).send({
                status: 400,
                error: message_status["code_400"],
                results: "product ID is not provided"
            });
        } else {
            const lookup = await service.viwe_by_id(id);
            if (lookup.status === 404) {
                return res.code(404).send({
                    status: 404,
                    error: message_status["code_404"],
                    results: `Failed to delete product with ID '${id}' : Not Found`
                });
            }
        }

        const result = await service.delete_by_id(id);
        switch (result.status) {
            case 200:
                return res.code(result.status).send({
                    status: result.status,
                    error: message_status["code_" + result.status],
                    results: result.results
                });

            case 500:
                return res.code(result.status).send({
                    status: result.status,
                    error: message_status["code_" + result.status],
                    results: result.error
                });

            default:
                return res.code(result.status).send({
                    status: result.status,
                    error: message_status["code_" + result.status],
                    results: null
                });
        }
    } catch (error) {
        console.error("An error occurred during controller 'delete_by_id' : ", error);
        return res.code(500).send({
            status: 500,
            error: error,
            results: null
        });
    }
};

