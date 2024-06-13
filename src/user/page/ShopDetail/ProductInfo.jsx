import { List, ListItem, ListItemText } from "@mui/material";

export default function ProductInfo({ productDatas }) {
    return (
        <>
            <h2>상품</h2>
            <hr />
            <List>
                {(!productDatas || productDatas.length === 0) && <p>아직 상품이 없어요</p>}
                {productDatas && productDatas.map(product => {
                    return (
                        <ListItem divider>
                            {product.imgUrl && (
                                <img
                                    src={product.imgUrl}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        overflowX: 'auto',
                                        marginRight: '16px'
                                    }}
                                    alt="상품 이미지"
                                />
                            )}
                            <ListItemText primary={product.name} secondary={`${product.price}원`} />
                        </ListItem>
                    )
                })}
            </List>
        </>
    );
}