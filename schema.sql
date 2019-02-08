CREATE TABLE applications (
  id serial primary key,
  name varchar(64) not null unique,
  email varchar(64),
  phone varchar(10),
  text text,
  job varchar(64),
  processed boolean default false,
  date timestamp with time zone not null
    default current_timestamp
);
