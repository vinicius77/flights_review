# Open Flights README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

## Installing Ruby

The recommended version for this project is Ruby 2.7.2

```
sudo apt install curl
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update
sudo apt-get install git-core zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev software-properties-common libffi-dev nodejs yarn
```

## Installing Rbenv

```
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

rbenv install --verbose 2.7.2
rbenv global 2.7.2
ruby -v
```

## Installing bundler

```
gem install bundler
```

## Installing Ruby

The recommended version for this project is Rails 6.0.3.4

```
gem install rails -v 6.0.3.4
```

Making Rails executable with <code>rbenv</code>

```
rbenv rehash
```

## Setting Up [Postgresql](https://www.digitalocean.com/community/tutorials/how-to-use-postgresql-with-your-ruby-on-rails-application-on-ubuntu-18-04)

```
sudo apt install postgresql postgresql-contrib libpq-dev
```

Creating a user with permission to create databases:

```
sudo -u postgres createuser kako77sub -s

# If you want to set a password for the user, you can do the following
sudo -u postgres psql
postgres= # \password kako77sub

# Enter new password:
# Enter it again:

postgres=# \q
```

Script that created this project:

```
rails new open-flights --webpack=react --database=postgresql -T
```

Creating the database:

```
rails db:create
```
