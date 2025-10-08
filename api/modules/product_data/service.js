const maria_query = require('../../util/maria_query');

exports.viwe_all = async () => {
    const select_maria = `
    SELECT
    p.product_id,
    p.store_id,
    s.store_name,
    u.user_username,
    u.user_fname,
    u.user_lname,
    u.user_phone_num,
    u.user_email,
    p.product_name,
    p.product_detail,
    p.product_price,
    p.product_category,
    p.product_stock,
    p.product_url_img,
    p.product_created_at
  FROM product AS p
  LEFT JOIN store  AS s ON p.store_id = s.store_id
  LEFT JOIN \`user\` AS u ON s.store_owner_id = u.user_id
  ORDER BY p.product_id ASC
`;
    try {
        const results = await maria_query(select_maria);
        return {
            status: 200,
            error: null,
            results: results
        };
    } catch (error) {
        console.error("An error occurred during service 'viwe_all' :", error);
        return {
            status: 500,
            error: error,
            results: null
        }
    }
}

exports.viwe_by_id = async (id) => {
    const select_maria = `
    SELECT
    p.product_id,
    p.store_id,
    s.store_name,
    u.user_username,
    u.user_fname,
    u.user_lname,
    u.user_phone_num,
    u.user_email,
    p.product_name,
    p.product_detail,
    p.product_price,
    p.product_category,
    p.product_stock,
    p.product_url_img,
    p.product_created_at
  FROM product AS p
  LEFT JOIN store  AS s ON p.store_id = s.store_id
  LEFT JOIN \`user\` AS u ON s.store_owner_id = u.user_id
  WHERE p.product_id = ?
`;
    try {
        const result = await maria_query(select_maria, [id]);
        if (result.length === 0) {
            console.error(`Failed to viwe product by ID '${id}' : Not Found`);
            return {
                status: 404,
                error: `Failed to viwe product by ID '${id}' : Not Found`,
                results: null
            };
        }

        console.log("viwe product by ID successfully");
        return {
            status: 200,
            error: null,
            results: result
        };
    } catch (error) {
        console.error("An error occurred during service 'viweById' : ", error);
        return {
            status: 500,
            error: error,
            results: null
        };
    }
};




// util: สร้าง product_id ใหม่ p00000001 → p00000002 ...
const nextProduct_Id = async () => {
    const rows = await maria_query(`
    SELECT product_id
    FROM next_e_stor.product
    WHERE product_id REGEXP '^p[0-9]{8}$'
    ORDER BY CAST(SUBSTRING(product_id, 2) AS UNSIGNED) DESC
    LIMIT 1
  `);
    if (!rows || rows.length === 0) return "p00000001";
    const last = rows[0].product_id;
    const num = parseInt(last.slice(1), 10) + 1;
    return "p" + String(num).padStart(8, "0");
};

exports.create = async (payload) => {
    try {
        const newId = await nextProduct_Id();

        const create_maria = `
      INSERT INTO product (
        product_id,
        store_id,
        product_name,
        product_detail,
        product_price,
        product_date,
        product_category,
        product_stock,
        product_url_img
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;




        // ตรวจความยาวแบบกันพลาดนิดนึง
        if (!Array.isArray(payload) || payload.length !== 8) {
            console.error("Invalid payload array (length must be 8)\nFailed to create product");
            return {
                statuscode: 500,
                error: "Failed to create product",
                results: null
            }
        }

        const params = [newId, ...payload];

        const result = await maria_query(create_maria, params);
        if (result.affectedRows !== 1) {
            throw new Error("Failed to create product");
        }

        return {
            status: 201,
            error: null,
            results: { product_id: newId }
        };
    } catch (error) {
        console.error("service 'create' :", error);
        return { status: 500, error, results: null };
    }
};



exports.update_by_id = async (id, payload = {}) => {
    const allowed = [
        "product_name",
        "product_detail",
        "product_price",
        "product_date",
        "product_category",
        "product_stock",
        "product_url_img",
    ];

    const sets = [];
    const params = [];

    for (const k of allowed) {
        if (Object.prototype.hasOwnProperty(payload, k)) {
            sets.push(`${k} = ?`);
            params.push(payload[k]);
        }
    }

    if (sets.length === 0) {
        return { status: 400, error: "No fields to update", results: null };
    }

    // อัปเดต timestamp ทุกครั้งที่แก้
    sets.push("product_updated_at = CURRENT_TIMESTAMP");

    const sqlUpdate = `UPDATE product SET ${sets.join(", ")} WHERE product_id = ?`;
    params.push(id);

    try {
        const result = await maria_query(sqlUpdate, params);
        if (result.affectedRows === 0) {
            return { status: 404, error: `Product '${id}' not found`, results: null };
        }

        const sqlSelect = `
      SELECT
        product_id               AS id,
        store_id,
        product_name,
        product_detail,
        product_price            AS price,
        product_date,
        product_category         AS category,
        product_stock            AS stock,
        product_url_img          AS image,
        product_created_at       AS created,
        product_updated_at       AS updated
      FROM product
      WHERE product_id = ?
      LIMIT 1
    `;
        const rows = await maria_query(sqlSelect, [id]);
        const row = rows?.[0] ?? null;

        return { status: 200, error: null, results: row };
    } catch (err) {
        return { status: 500, error: err?.message || String(err), results: null };
    }
};


// // V2
// exports.update_by_id_v2 = async (id, payload = {}) => {



// }


// exports.delete_by_id = async (id) => {
//     const sets = [];
//     const delete_maria = `
//         SELECT
//             product_status
//             fk_user_id
//         FROM product
//         WHERE product_id = ? AND product_status = 1;
//     `;
//     try {
//         const result = await maria_query(delete_maria, [id]);
//         if (result.length === 0) {
//             console.error(`Failed to delete product with ID '${id}'`);
//             return {
//                 status: 500,
//                 error: `Failed to delete product with ID '${id}'`,
//                 results: null
//             }
//         }

//         console.log("Delete product successfully");
//         return {
//             status: 200,
//             error: null,
//             results: "Delete product successfully"
//         };
//     } catch (error) {
//         console.error("An error occurred during service 'delete_by_id' : ", error);
//         return {
//             status: 500,
//             error: error,
//             results: null
//         };
//     }
// };

exports.delete_by_id = async (id) => {

    const delete_maria = `
        UPDATE product
        SET 
            product_status = 0,
            fk_user_id = ?,
            product_updated_at = NOW()
        WHERE product_id = ? AND product_status = 1;

        SELECT product_id, product_status, product_updated_at, fk_user_id
        FROM product
        WHERE product_id = ?;
    `;
    try {
        const result = await maria_query(delete_maria, [id]);
        if (result.length === 0) {
            console.error(`Failed to delete product with ID '${id}'`);
            return {
                status: 500,
                error: `Failed to delete product with ID '${id}'`,
                results: null
            }
        }
        console.log("Delete product successfully");
        return {
            status: 200,
            error: null,
            results: "Delete product successfully"
        };
    } catch (error) {
        console.error("An error occurred during service 'delete_by_id' : ", error);
        return {
            status: 500,
            error: error,
            results: null
        };
    }


};