-- (1) Assignment 2 Insert Query .
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
    VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n' );


-- (2) Update (This one is for some reason having issues, but I am pretty positive I have written it correctly).
UPDATE public.account
    SET account_type = 'Admin'
    WHERE account_firstname = 'Tony';


-- (3) Delete the Insert from number (1).
DELETE FROM public.account
	WHERE account_firstname = 'Tony';


-- (4) GM Hummer Replace Query.
UPDATE public.inventory
    SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior' )
    WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- (5) Inner Join Make and Model and Classification name in the 'Sport' category.
SELECT i.inv_make, i.inv_model, c.classification_name
    FROM public.inventory AS i 
    INNER JOIN classification AS c ON c.classification_id = i.classification_id
    WHERE c.classification_name = 'Sport';


-- (6) Updating the inventory images and thumbnails.
UPDATE public.inventory
	SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'), 
		inv_thumbnail = REPLACE(inv_image, '/images', '/images/vehicles');